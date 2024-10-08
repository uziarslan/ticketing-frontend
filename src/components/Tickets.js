import React, { useEffect, useState, useRef, useContext } from "react";
import "../assets/css/styles.min.css";
import axiosInstanceAdmin from "../services/axiosInstanceAdmin";
import { AuthContext } from "../Context/AuthContext";
import Loader from "./Loader";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [assignedTo, setAssignedTo] = useState("");
  const [comment, setComment] = useState("");
  const commentsEndRef = useRef(null);
  const { isLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        // setIsLoading(true);
        const response = await axiosInstanceAdmin.get("/get-all-tickets");
        setTickets(response.data.openedTickets);
        // setIsLoading(false);
      } catch (error) {
        console.error(error);
        // setIsLoading(false);
      }
    };

    fetchTicket();
  }, [tickets]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [modalContent.comments]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleChangeStatus = async (ticketId, status) => {
    try {
      const response = await axiosInstanceAdmin.post(`/change/${ticketId}`, {
        status,
        assignedTo,
      });
      if (response.status === 200) {
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    setComment("");
    if (comment.trim() === "") {
      return;
    }
    try {
      const response = await axiosInstanceAdmin.post(
        `/add-comment/${modalContent._id}`,
        { comment, senderId: null }
      );
      if (response.status === 200) {
        setModalContent(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const keysToSkip = ["requesterName", "requestType"];

  if (isLoading) {
    return <Loader />;
  }

  if (!tickets.length) return null;

  return (
    <>
      <div className="ticket-detail">
        <table>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Category</th>
              <th>Ticket Description</th>
              <th>Creation Date</th>
              <th>Raised By</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={index}>
                <td>{ticket._id}</td>
                <td>{ticket.content.requestType || ticket.content.subject}</td>
                <td>
                  <button className="showButton" onClick={() => handleModalClick(ticket)}>Show</button>
                </td>
                <td>{ticket.startDate.split("T")[0]}</td>
                <td>{ticket.content.requesterName}</td>
                <td>{ticket.assignedTo}</td>
                <td className={`status ${ticket.status}`}>
                  {ticket.status === "opened" ? "Open" : ticket.status === "processing" ? "In Progress" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal2" onClick={closeModal}>
          <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalHeaderText">Ticket Details</h2>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
            </div>
            <h2>{modalContent.content.requestType}</h2>
            <ul>
              {Object.entries(modalContent.content)
                .filter(([key]) => !keysToSkip.includes(key))
                .map(
                  ([key, value], index) =>
                    value !== "" && (
                      <li key={index}>
                        <strong className="keyText">{key} </strong>
                        <br />
                        {value !== true ? value.toString() : ""}
                      </li>
                    )
                )}
            </ul>
            <hr />
            <div className="form-group">
              <h3 className="assignedTo">Assigned to</h3>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="Dexter Hazelton">Dexter Hazelton</option>
                <option value="Kushal Kothari">Kushal Kothari</option>
                <option value="Nikhil Pujari">Nikhil Pujari</option>
                <option value="Kiran Raj">Kiran Raj</option>
                <option value="Vishnu Vardhan Naidu Yasarapu">
                  Vishnu Vardhan Naidu Yasarapu
                </option>
                <option value="Bhanu Thipparthi">Bhanu Thipparthi</option>
              </select>
            </div>
            <hr />
            <div className="comment-section">
              <h3>Comments</h3>
              <ul className="comment-list">
                {modalContent.comments.map((commentObj, index) => (
                  <li
                    key={index}
                    className={commentObj.sender ? "received" : "sent"}
                  >
                    {commentObj.comment}
                  </li>
                ))}
                <div ref={commentsEndRef} />
              </ul>
              <div className="inputAndButtonWrapper">
                <input
                  className="commentInput"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment"
                />
                <button onClick={() => handleAddComment()}>Send</button>
              </div>
            </div>
            <div className="buttonWrapper">
              <button
                onClick={() => handleChangeStatus(modalContent._id, "closed")}
                className="modalButton closed"
              >
                Close Ticket
              </button>
              <button
                onClick={() =>
                  handleChangeStatus(modalContent._id, "processing")
                }
                className="modalButton process"
              >
                Process Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ticket;
