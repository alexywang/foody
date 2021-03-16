import React from 'react';
import OpenTable, { positions } from 'react-opentable';
// import 'react-opentable/dist/index.css';
import './OpenTable.css';

export function FoodyOpenTable({ openTableLink }) {
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

  if (!openTableLink) return null;

  return (
    <OpenTable
      rid={getOpenTableRid(openTableLink)}
      customClassName="custom-ot-wrapper"
      position={positions.POSITION_UNSET}
      iframe={true}
      theme="tall"
    />
  );
}
