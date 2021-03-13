export function OpenTable({ openTableLink }) {
  function getOpenTableWidgetLink(openTableLink) {
    const numerics = openTableLink.match(/[0-9]+/gm);
    if (!numerics) return null;
    const rid = numerics[0];
    return `//www.opentable.ca/widget/reservation/loader?rid=${rid}&type=standard&theme=tall&iframe=false&domain=ca&lang=en-CA&newtab=false&ot_source=Other`;
  }

  if (!openTableLink) return null;

  return (
    <div className="open-table-container">
      <div className="open-table-widget">
        <script type="text/javascript" src={getOpenTableWidgetLink(openTableLink)}></script>
      </div>
    </div>
  );
}
