const LOGO_PATH = '/logos/';
function SourceSelector({ setSource, source }) {
  function renderSelector(sourceName) {
    if (source != sourceName) {
      return `${LOGO_PATH}${sourceName}.svg`;
    } else {
      return `${LOGO_PATH}${sourceName}.svg`;
    }
  }
}
