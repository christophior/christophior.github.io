import React from 'react'

export const renderIcon = ({url, icon}, index) => (<li key={index}><a href={url} className={`icon icon-${icon}`}></a></li>);

export const renderLink = ({url, content}, index) => (<li key={index}><a href={url} target='_blank'>{content}</a></li>);

export const header = (tagLine) => (
    <header>
        <div className="avatar"></div>
        <p>{tagLine}</p>
    </header>
);