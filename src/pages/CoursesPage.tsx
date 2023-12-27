import React, {useEffect, useState} from 'react';
import axios, {AxiosResponse} from 'axios';
import {Link} from "react-router-dom";
import {Course} from "../utils/type/course";

const Pagination = ({totalPages, currentPage, onPageChange}: any) => {
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                        Previous
                    </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => onPageChange(index + 1)}>
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const SearchBar = ({onSearch}: any) => {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        onSearch(keyword);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetchCourses();
    }, [currentPage, searchKeyword, sortOrder]);

    const fetchCourses = () => {
        const getTokenFromLocalStorage = () => {
            return localStorage.getItem('authToken') || '';
        };

        const token = getTokenFromLocalStorage();

        if (token) {
            axios
                .get('/api/v1/admin/courses', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        page: currentPage - 1,
                        size: 8,
                        sortBy: 'name',
                        sortOrder,
                        keyword: searchKeyword,
                    },
                })
                .then((response: AxiosResponse<any>) => {
                    if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
                        const data = response.data.data.content as Course[];
                        setCourses(data);
                        setTotalPages(response.data.data.totalPages);
                    } else {
                        console.error('Invalid data format');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching courses:', error);
                });
        }
    };

    const handleDeleteCourse = (id: number) => {
        const getTokenFromLocalStorage = () => {
            return localStorage.getItem('authToken') || '';
        };

        const token = getTokenFromLocalStorage();

        if (token) {
            axios
                .delete(`/api/v1/courses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    console.log(`Course with ID ${id} deleted successfully.`);
                    fetchCourses(); // Refresh the course list after deletion
                })
                .catch((error) => {
                    console.error('Error deleting course:', error);
                });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = (keyword: string) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
    };

    const handleSortToggle = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
        setCurrentPage(1);
    };

    const handleChageSuccess = () => {
        fetchCourses();
    };

    return (
        <div style={{minHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{flex: '1 0 auto'}}>
                <h1>Course List</h1>
                <div style={{display: 'flex', alignItems: 'center', paddingBottom: '20px'}}>
                    <SearchBar onSearch={handleSearch}/>
                    <button onClick={handleSortToggle} style={{marginLeft: '10px'}}>
                        Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </button>
                </div>
                <div style={{overflowX: 'auto'}}>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Code</th>
                            <th>Credit Count</th>
                            <th>Maximum Student Count</th>
                            <th>Lecturer ID</th>
                            <th>Classroom</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.code}</td>
                                <td>{course.creditCount}</td>
                                <td>{course.maxStudentCount}</td>
                                <td>{course.lecturerId}</td>
                                <td>{course.classroom}</td>
                                <td className="col-2">
                                    <Link to={`/courses/modify/${course.id}`}>
                                        <button type="button" className="btn btn-secondary" style={{marginRight: '10px'}}>Modify</button>
                                    </Link>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
                <Link to="/courses/add" style={{ marginLeft: '10px', marginTop: '5px' }}>
                    <button type="button" className="btn btn-primary">+</button>
                </Link>
            </div>
        </div>
    );
};

export default CoursesPage;
