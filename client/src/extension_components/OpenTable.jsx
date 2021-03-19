import React, { useEffect, useState } from 'react';
import OpenTable, { positions } from 'react-opentable';
// import 'react-opentable/dist/index.css';
import './OpenTable.css';

export function FoodyOpenTable({ openTableLink }) {
  const [openTableTheme, setOpenTableTheme] = useState('tall');

  useEffect(() => {
    setOpenTableTheme(determineWidgetTheme());
    window.addEventListener('resize', () => {
      setOpenTableTheme(determineWidgetTheme());
    });
  }, []);

  function determineWidgetTheme() {
    if (getWindowWidth() < 1200) {
      return 'standard';
    } else {
      return 'tall';
    }
  }

  function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  function getOpenTableWidgetLink(openTableLink) {
    const numerics = openTableLink.match(/[0-9]+/gm);
    if (!numerics) return null;
    const rid = numerics[0];
    return `//www.opentable.ca/widget/reservation/loader?rid=${rid}&type=standard&theme=tall&iframe=false&domain=ca&lang=en-CA&newtab=false&ot_source=Other`;
  }

  function getOpenTableRid(link) {
    const numbers = link.match(/[0-9]+/gm);
    if (!numbers) return null;
    return numbers[0];
  }

  if (!openTableLink || getOpenTableRid(openTableLink) == null) {
    return (
      <div style={{ marginTop: '75%', color: 'rgb(247, 195, 190)' }}>
        <p>
          <center>We couldn't find the restaurant on Open Table :(</center>
        </p>
      </div>
    );
  }

  return (
    <div>
      <OpenTable
        rid={getOpenTableRid(openTableLink)}
        customClassName="custom-ot-wrapper"
        position={positions.POSITION_UNSET}
        iframe={true}
        theme={openTableTheme}
      />
    </div>
  );
}
