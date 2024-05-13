import React, { useState, useEffect } from 'react';

export const HoverHistory = ({ data }) => {

    useEffect(() => {
        console.log(data);
      }, []);
      return (
        <div>
          {Object.keys(data).map((key) => (
            <div key={key}>
              <h2>{data[key].Question}</h2>
              <p>{data[key].Answer}</p>
            </div>
          ))}
        </div>
      );
    };