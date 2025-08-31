import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import "./Sidebar.css";

const Sidebar = ({ auth: { user }, logout, isOpen, toggleSidebar }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
          <h1 className="sidebar-header">Expense Tracker</h1>
          <div className="sidebar-profile">
            <div className="sidebar-profile-img">
              {user && user.avatar ? user.avatar : getInitials(user?.name)}
            </div>
            <h3>{user && user.name}</h3>
          </div>
          <ul className="sidebar-nav">
            <li className="sidebar-nav-item">
              <NavLink to="/" exact className="sidebar-nav-link" activeClassName="active" onClick={isOpen ? toggleSidebar : null}>
                <span className="sidebar-nav-icon">📊</span> Dashboard
              </NavLink>
            </li>
            <li className="sidebar-nav-item">
              <NavLink to="/income" className="sidebar-nav-link" activeClassName="active" onClick={isOpen ? toggleSidebar : null}>
                <span className="sidebar-nav-icon">💰</span> Income
              </NavLink>
            </li>
            <li className="sidebar-nav-item">
              <NavLink to="/expense" className="sidebar-nav-link" activeClassName="active" onClick={isOpen ? toggleSidebar : null}>
                <span className="sidebar-nav-icon">💸</span> Expense
              </NavLink>
            </li>
             <li className="sidebar-nav-item">
              <NavLink to="/goals" className="sidebar-nav-link" activeClassName="active" onClick={isOpen ? toggleSidebar : null}>
                <span className="sidebar-nav-icon">🎯</span> Goals
              </NavLink>
            </li>
          </ul>
          <div className="sidebar-logout">
            <a onClick={() => { logout(); if (isOpen) toggleSidebar(); }} href="#!" className="sidebar-nav-link">
              <span className="sidebar-nav-icon">🚪</span> Logout
            </a>
          </div>
      </div>
      <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={toggleSidebar} />
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Sidebar);