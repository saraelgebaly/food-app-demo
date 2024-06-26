import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../../../../Context/AuthContext";
import { ToastContext } from "../../../../Context/ToastContext";
import userLogo from "../../../../assets/images/header.png";
import nodata from "../../../../assets/images/no-data.png";
import DeleteData from "../../../SharedModule/components/DeleteData/DeleteData";
import NoData from "../../../SharedModule/components/NoData/NoData";
import Header from "../../../SharedModule/components/header/Header";
import Loading from "../../../SharedModule/components/Loading/Loading";
export default function UsersList() {
  let { baseUrl, requestHeaders, loginData } = useContext(AuthContext);
  let { getToastValue } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  const [usersList, setUsersList] = useState([]);
  const [userNameValue, setUserNameValue] = useState([]);
  const [group, setGroup] = useState([1, 2]);

  const [arrayOfPages, setArrayOfPages] = useState([]);
  const [userId, setUserId] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = (id) => {
    setUserId(id);
    setShowDelete(true);
  };

  const getUsersList = async (userName, groups, pageSize, pageNo) => {
    try {
      const response = await axios.get(
        `${baseUrl}/Users/?pageSize=${pageSize}&pageNumber=${pageNo}`,

        {
          headers: requestHeaders,
          params: {
            userName: userName,
            groups: groups,
          },
        }
      );
      setArrayOfPages(
        Array(response.data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );
      setUsersList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserNameValue = (input) => {
    setUserNameValue(input.target.value);
    getUsersList(input.target.value, group, 20, 1);
  };

  const getGroupValue = (input) => {
    setGroup(input.target.value);

    if (input.target.value == 1) {
      getUsersList(userNameValue, 1, 20, 1);
    } else getUsersList(userNameValue, 2, 20, 1);
  };
  const onDeleteSubmit = async () => {
    try {
      const response = await axios.delete(
        `${baseUrl}/Users/${userId}`,

        {
          headers: requestHeaders,
        }
      );
      getToastValue("success", "Successfully deleted User");

      handleDeleteClose();
      getUsersList(userNameValue, group, 40, 1);
    } catch (error) {
      getToastValue("error", error.response.message);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    getUsersList(userNameValue, group, 40, 1);
  }, []);
  return (
    <>
      <Header
        title={"Users list"}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        imgUrl={userLogo}
      />
      <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Body>
          <DeleteData deleteItem={"User"} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="container-fluid p-4 ">
            <div className="row">
              <div className="col-md-6">
                <h3>Users Table Details</h3>
                <p>You can check all details</p>
              </div>
            </div>
          </div>
          <div className="filteration m-3">
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="search by username..."
                  onChange={getUserNameValue}
                />
              </div>
              <div className="col-md-3">
                <select className="form-control" onChange={getGroupValue}>
                  <option value="">Search by Group</option>

                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                </select>
              </div>
            </div>
          </div>
          <div className="categories-body">
      <ul className="responsive-table-categories">
        <li className="table-header">
          <div className="col col-1">#</div>
          <div className="col col-2">Name</div>
          <div className="col col-3">Image</div>
          <div className="col col-4">Email</div>

          <div className="col col-5">Counrty</div>
          <div className="col col-6">Phone Number</div>
          <div className="col col-7">Group</div>
          <div className="col col-8"></div>
        </li>
      </ul>

      <ul className="responsive-table-categories">
        
        {usersList.length > 0 ? (
                usersList.map((item, index) => (
                  <li className="table-row">
                  <div className="col col-1" data-label="#">{index + 1}</div>
                  <div className="col col-2" data-label="Name :">{item.userName}</div>
                  <div className="col col-3" data-label="Image :">{item.imagePath ? (
                        <img
                          className="recipes-img"
                          src={
                            "https://upskilling-egypt.com:3006/" +
                            item.imagePath
                          }
                          alt=""
                        />
                      ) : (
                        <img className="recipes-img" src={nodata} alt="" />
                      )}</div>
                  <div className="col col-4" data-label="Email :">{item.email}</div>
                  <div className="col col-5" data-label="Country :">{item.country}</div>
                  <div className="col col-6" data-label="Phone Number :">{item.phoneNumber}</div>
                  <div className="col col-7" data-label="Group :">{item.group.name}</div>
                  <div className="col col-8" data-label="">
                    
                  <button className="btn-icon" onClick={() => handleDeleteShow(item.id)}>
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                  
                  </div>
                  </li>

                ))): (<NoData/>)}
         
      </ul>
      
    </div>
          {/* <table className="table mx-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Image</th>
                <th scope="col">Email</th>
                <th scope="col">Counrty</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Group</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length > 0 ? (
                usersList.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row"> {index + 1} </th>
                    <td>{item.userName}</td>
                    <td>
                      {item.imagePath ? (
                        <img
                          className="recipes-img"
                          src={
                            "https://upskilling-egypt.com:3006/" +
                            item.imagePath
                          }
                          alt=""
                        />
                      ) : (
                        <img className="recipes-img" src={nodata} alt="" />
                      )}
                    </td>
                    <td>{item.email}</td>
                    <td>{item.country}</td>
                    <td>{item.country}</td>
                    <td>{item.group.name}</td>
                    <td>
                      <button className="btn-icon" onClick={() => handleDeleteShow(item.id)}>
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <NoData />
              )}
            </tbody>
          </table> */}
          <nav
            aria-label="Page navigation example"
            className="d-flex justify-content-center"
          >
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link text-success" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              {arrayOfPages.map((pageNo) => (
                <li
                  onClick={() => getUsersList(userNameValue, group, 40, pageNo)}
                  className="page-item"
                >
                  <a className="page-link text-success">{pageNo}</a>
                </li>
              ))}

              <li className="page-item">
                <a className="page-link text-success" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
