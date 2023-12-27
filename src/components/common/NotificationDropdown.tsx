import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import SimpleBar from "simplebar-react";

interface NotificationItem {
    id: number;
    title: string;
    body: string;
    createdDate: string;
}

interface ApiResponse {
    data: {
        content: NotificationItem[];
    };
}

const notificationContainerStyle = {
    maxHeight: "230px",
    display: "none",
};

const notificationShowContainerStyle = {
    maxHeight: "230px",
    display: "block",
};

interface NewNotification {
    title: string;
    body: string;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: any) => {
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                    <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    </li>
                ))}
                <li
                    className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                    }`}
                >
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

const NotificationDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationContentStyle, setNotificationContentStyles] = useState(
        notificationContainerStyle
    );
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newNotificationFields, setNewNotificationFields] = useState<
        NewNotification
    >({
        title: "",
        body: "",
    });
    const [currentPage, setCurrentPage] = useState(0); // Current page
    const [totalPages, setTotalPages] = useState(0); // Total number of pages
    const pageSize = 20; // Number of notifications per page

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            return;
        }

        axios
            .get<ApiResponse>("/api/v1/notifications", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then((response) => {
                const totalNotifications = response.data.data.content.length;
                setTotalPages(Math.ceil(totalNotifications / pageSize)); // Calculate totalPages
                setNotifications(response.data.data.content);
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
            });
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setNotificationContentStyles((prevStyle) => ({
            ...prevStyle,
            display:
                prevStyle.display === notificationContainerStyle.display
                    ? notificationShowContainerStyle.display
                    : notificationContainerStyle.display,
        }));
    };

    const openAddNotificationModal = () => {
        setShowModal(true);
    };

    const handleAddNotification = () => {
        // Create a new notification object with only title and body
        const newNotification = {
            title: newNotificationFields.title,
            body: newNotificationFields.body,
        };

        // Send the new notification to the backend
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            return;
        }

        axios
            .post("/api/v1/notifications", newNotification, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then((response) => {
                // Reload notifications from the backend
                axios
                    .get<ApiResponse>("/api/v1/notifications", {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    })
                    .then((response) => {
                        setNotifications(response.data.data.content);
                    })
                    .catch((error) => {
                        console.error("Error fetching notifications:", error);
                    });
            })
            .catch((error) => {
                console.error("Error creating notification:", error);
            });

        // Close the modal
        setShowModal(false);
    };

    return (
        <div>
            <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
                <Dropdown.Toggle
                    id="dropdown-notification"
                    as="a"
                    onClick={toggleDropdown}
                    className={classNames("nav-link waves-effect waves-light", {
                        show: dropdownOpen,
                    })}
                >
                    <FontAwesomeIcon icon={faBell} />
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className={classNames("notification-dropdown", {
                        show: dropdownOpen,
                    })}
                    style={{ minWidth: "500px" }}
                >
                    <div
                        className="dropdown-item noti-title"
                        style={{ backgroundColor: "lightcyan" }}
                    >
                        <h5 style={{ textAlign: "center", textDecorationLine: "underline" }}>
                            Notification
                        </h5>
                    </div>

                    <div
                        className="notification-content"
                        style={{
                            ...notificationContentStyle,
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        <SimpleBar style={{ maxHeight: "200px" }}>
                            {/* Render existing notifications */}
                            {notifications.length === 0 ? (
                                <div className="notification-item">No new notifications.</div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="list-group-item list-group-item-action"
                                    >
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1">{notification.title}</h5>
                                            <small>
                                                {new Date(notification.createdDate).toLocaleString()}
                                            </small>
                                        </div>
                                        <p className="mb-1">{notification.body}</p>
                                    </div>
                                ))
                            )}
                        </SimpleBar>
                    </div>

                    {/*/!* Pagination controls using the Pagination component *!/*/}
                    {/*<Pagination*/}
                    {/*    totalPages={totalPages}*/}
                    {/*    currentPage={currentPage}*/}
                    {/*    onPageChange={setCurrentPage}*/}
                    {/*/>*/}
                    {/*/!* End of pagination controls *!/*/}
                    <Button
                        variant="primary"
                        onClick={openAddNotificationModal}
                        className="mt-3"
                    >
                        Add Notification
                    </Button>
                </Dropdown.Menu>
            </Dropdown>

            {/* Render the AddNotificationModal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={newNotificationFields.title}
                                onChange={(e) =>
                                    setNewNotificationFields({
                                        ...newNotificationFields,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="body">
                            <Form.Label>Body</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter body"
                                value={newNotificationFields.body}
                                onChange={(e) =>
                                    setNewNotificationFields({
                                        ...newNotificationFields,
                                        body: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddNotification}>
                        Add Notification
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NotificationDropdown;
