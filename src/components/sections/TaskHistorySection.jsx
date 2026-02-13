import React from 'react';
import moment from 'moment';
import './TaskHistorySection.css';

const TaskHistorySection = ({ leadTasks, handleUpdateTaskStatus }) => {
    return (
        <div className="task-history-section">
            {leadTasks.length > 0 ? (
                leadTasks.slice().reverse().map((task) => (
                    <div key={task._id} className={`task-history-item ${task.status === 'Done' ? 'done' : ''}`}>
                        <div className="task-history-header">
                            <div>
                                <h3 className="task-history-subject">{task.subject}</h3>
                                <p className="task-history-body">{task.body}</p>
                            </div>
                            <span className={`task-history-status ${task.status === 'Open' ? 'open' : 'done'}`}>{task.status}</span>
                        </div>
                        <hr className="task-history-divider" />
                        <div className="task-history-footer">
                            <div className="task-history-meta">
                                Created by: <strong>{task.createdByName}</strong> on {moment(task.createdAt).format('DD MMM YYYY')}
                                <br />
                                Assigned to: <strong>{task.assignedToName}</strong>
                            </div>
                            {task.status === 'Open' && (
                                <button
                                    className="task-history-button"
                                    onClick={() => handleUpdateTaskStatus(task._id, 'Done')}
                                >
                                    Mark as Done
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="task-history-empty">
                    No tasks have been created for this lead.
                </p>
            )}
        </div>
    );
};

export default TaskHistorySection;
