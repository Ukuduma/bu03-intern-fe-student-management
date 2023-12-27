import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {Course} from '../utils/type/course';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';


const AddCourseForm = () => {
    const history = useHistory();
    const [courseData, setCourseData] = useState<Course>({
        id: 0,
        name: '',
        code: '',
        creditCount: 0,
        maxStudentCount: 0,
        classroom: '',
        lecturerId: undefined,
        departmentId: undefined,
        scheduleId: undefined,
        status: false, // Default status is inactive
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        let parsedValue: string | number | boolean | undefined;

        if (type === 'checkbox') {
            parsedValue = checked;
        } else if (name === 'lecturerId' || name === 'departmentId' || name === 'scheduleId') {
            parsedValue = value === '' ? undefined : parseInt(value, 10);
        } else {
            parsedValue = value;
        }

        setCourseData((prevData) => ({
            ...prevData,
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
            const response = await axios.post<Course>('/api/v1/courses', courseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Assuming the API returns the newly created course data in the response.
            const responseData = response.data as Course;
            console.log('New course added:', responseData);
            // Redirect to the CoursesPage after successful creation
            history.push('/courses');
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleCancel = () => {
        history.push('/courses'); // Redirect to the CoursesPage without making any changes
    };

    return (
        <div className="container mt-4">
            <h1>Add New Course</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Course Name:</label>
                    <input type="text" name="name" value={courseData.name} onChange={handleInputChange}
                           className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Code:</label>
                    <input type="text" name="code" value={courseData.code} onChange={handleInputChange}
                           className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Credit Count:</label>
                    <input type="number" name="creditCount" value={courseData.creditCount} onChange={handleInputChange}
                           className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Max Student Count:</label>
                    <input type="number" name="maxStudentCount" value={courseData.maxStudentCount}
                           onChange={handleInputChange} className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Lecturer ID:</label>
                    <input type="number" name="lecturerId" value={courseData.lecturerId} onChange={handleInputChange}
                           className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Department ID:</label>
                    <input type="number" name="departmentId" value={courseData.departmentId}
                           onChange={handleInputChange} className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Schedule ID:</label>
                    <input type="number" name="scheduleId" value={courseData.scheduleId} onChange={handleInputChange}
                           className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label>Classroom:</label>
                    <input type="text" name="classroom" value={courseData.classroom} onChange={handleInputChange}
                           className="form-control" required/>
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Status:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name="status"
                            checked={courseData.status}
                            onChange={handleInputChange}
                            style={{ marginRight: '5px' }}
                        />
                        {courseData.status ? 'Active' : 'Inactive'}
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px'
                }}>
                    <button type="submit" className="btn btn-primary">Add Course</button>
                    <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddCourseForm;
