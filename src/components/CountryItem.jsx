import styles from "./CountryItem.module.css";

function flagEmojiToCountryCode(emoji) {
  if (!emoji) return null;
  const codePoints = Array.from(emoji);
  if (codePoints.length !== 2) return null;

  return codePoints
    .map((char) => String.fromCharCode(char.codePointAt(0) - 127397))
    .join('');
}
function CountryItem({ country }) {
  const countryCode =
  country.emoji.length === 2 && /^[A-Z]{2}$/.test(country.emoji)
    ? country.emoji
    : flagEmojiToCountryCode(country.emoji);
  return (
    <li className={styles.countryItem}>
      <span>{countryCode ? (
            <img
                src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                alt={`${country.country} flag`}
                width="24"
                height="18"
                style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            ) : (
            <span>🏳️</span> // fallback emoji if conversion fails
            )}
      </span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
