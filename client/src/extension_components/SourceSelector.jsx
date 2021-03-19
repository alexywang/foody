import './SourceSelector.css';
const LOGO_PATH = '/logos/';

const LOGO_SIZE = 30;
export function SourceSelector({ setSource, source }) {
  const SOURCE_NAMES = ['Yelp', 'Google'];

  function getSourceLogo(sourceName) {
    if (source != sourceName) {
      return `${LOGO_PATH}${sourceName}.svg`;
    } else {
      return `${LOGO_PATH}${sourceName}.svg`;
    }
  }

  return (
    <span className="source-selector-container">
      {SOURCE_NAMES.map((sourceName, id) => {
        const className = sourceName === source ? '' : 'grayscale';
        return (
          <img
            key={sourceName}
            className={className}
            onClick={() => {
              setSource(sourceName);
            }}
            src={getSourceLogo(sourceName)}
            width={LOGO_SIZE}
            style={{ marginTop: -LOGO_SIZE / 2 - 5 }}
          />
        );
      })}
    </span>
  );
}
