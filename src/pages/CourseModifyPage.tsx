import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios'; // Import AxiosResponse
import { Course } from '../utils/type/course';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

// Define a custom type for the response data
interface CourseApiResponse {
    data: Course; // Assuming the course data is directly under the 'data' field
}

const CourseModifyPage = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [course, setCourseData] = useState<Course | null>({
        id: 0,
        name: '',
        code: '',
        creditCount: 0,
        maxStudentCount: 0,
        classroom: '',
        lecturerId: undefined,
        departmentId: undefined,
        scheduleId: undefined,
    });

    useEffect(() => {
        const courseId = parseInt(id, 10);
        const getTokenFromLocalStorage = () => {
            return localStorage.getItem('authToken') || '';
        };

        const fetchCourseData = async () => {
            try {
                const token = getTokenFromLocalStorage();
                const response = await axios.get<CourseApiResponse>(`/api/v1/courses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responseData = response.data.data;
                setCourseData(responseData);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        fetchCourseData();
    }, [id]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        let parsedValue: string | number | boolean | undefined;

        if (type === "checkbox") {
            parsedValue = checked;
        } else if (
            name === "creditCount" ||
            name === "maxStudentCount" ||
            name === "lecturerId" ||
            name === "departmentId" ||
            name === "scheduleId"
        ) {
            parsedValue = value.trim() === "" ? undefined : parseInt(value, 10);
            if (isNaN(parsedValue as number)) {
                parsedValue = undefined;
            }
        } else {
            parsedValue = value;
        }

        setCourseData((prevCourse: Course | null) => ({
            ...(prevCourse as Course),
            [name]: parsedValue,
        }));
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const getTokenFromLocalStorage = () => {
            return localStorage.getItem('authToken') || '';
        };

        const token = getTokenFromLocalStorage();

        try {
            await axios.put(`/api/v1/courses/${id}`, course, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Course updated successfully
            console.log('Course updated successfully!');
            history.push('/courses'); // Redirect to the CoursesPage after successful update
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };


    const handleCancel = () => {
        history.goBack(); // Go back to the previous page
    };

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Modify Course</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label className="form-label">Course Name:</label>
                    <input type="text" name="name" value={course.name} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Code:</label>
                    <input type="text" name="code" value={course.code} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Classroom:</label>
                    <input
                        type="text"
                        name="classroom"
                        value={course.classroom}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Credit Count:</label>
                    <input type="text" name="creditCount" value={course.creditCount} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Max Student Count:</label>
                    <input type="text" name="maxStudentCount" value={course.maxStudentCount} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Lecturer ID:</label>
                    <input type="text" name="lecturerId" value={course.lecturerId} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Department ID:</label>
                    <input type="text" name="departmentId" value={course.departmentId} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Schedule ID:</label>
                    <input type="text" name="scheduleId" value={course.scheduleId} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Status:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="status"
                            checked={course.status}
                            onChange={handleInputChange}
                            style={{ marginRight: '5px' }}
                        />
                        {course.status ? 'Active' : 'Inactive'}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default CourseModifyPage;
