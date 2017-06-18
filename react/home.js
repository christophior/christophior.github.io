import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import { header, renderIcon, renderLink } from './homeComponents'

var info = require('../config/info.json');

let { metaData, tagLine, icons, links } = info;

const HomePage = () => (
    <div>
        { header(tagLine) }
        <ul className="icons">{ icons.map(renderIcon) }</ul>
        <hr />
        <ul className="links">{ links.map(renderLink) }</ul>
    </div>
)

// set metadata
$('title').text(metaData.title);
$('meta[name="description"]').attr("content", metaData.description);
$('meta[name="twitter:title"]').attr("content", metaData.title);
$('meta[name="twitter:description"]').attr("content", metaData.description);

ReactDOM.render(HomePage(), document.getElementById('wrapper'));