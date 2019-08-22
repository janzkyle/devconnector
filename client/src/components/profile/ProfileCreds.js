import React, { Component } from "react";
import Moment from "react-moment";
import isEmpty from "../../validation/is-empty";

class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expItems = experience.map(exp => (
      <li key={exp._id} className="list-group-item">
        <h4>{exp.company}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -
          {isEmpty(exp.to) ? (
            " Present"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </p>
        <p>
          <strong>Position:</strong> {exp.title}
        </p>
        <p>
          {isEmpty(exp.location) ? null : (
            <span>
              <strong>Location: </strong> {exp.location}
            </span>
          )}
        </p>
        <p>
          {isEmpty(exp.description) ? null : (
            <span>
              <strong>Description:</strong> {exp.description}
            </span>
          )}
        </p>
      </li>
    ));

    const eduItems = education.map(edu => (
      <li key={edu._id} className="list-group-item">
        <h4>{edu.school}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
          {edu.to === null ? (
            " Present"
          ) : (
            <Moment format="YYYY/MM/DD">{edu.to}</Moment>
          )}
        </p>
        <p>
          <strong>Degree:</strong> {edu.degree}
        </p>
        <p>
          <strong>Field of Study:</strong> {edu.fieldofstudy}
        </p>
        <p>
          {isEmpty(edu.location) ? null : (
            <span>
              <strong>Location: </strong> {edu.location}
            </span>
          )}
        </p>
        <p>
          {isEmpty(edu.description) ? null : (
            <span>
              <strong>Description:</strong> {edu.description}
            </span>
          )}
        </p>
      </li>
    ));
    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">{expItems}</ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          <ul className="list-group">{eduItems}</ul>
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
