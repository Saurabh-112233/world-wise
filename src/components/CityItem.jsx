import { Link } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCity } from '../context/CitiesContext';
function flagEmojiToCountryCode(emoji) {
    if (!emoji) return null;
    const codePoints = Array.from(emoji);
    if (codePoints.length !== 2) return null;
  
    return codePoints
      .map((char) => String.fromCharCode(char.codePointAt(0) - 127397))
      .join('');
  }

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  
export default function CityItem({ city }) {
  const {currentCity,deleteCity} = useCity();
  const { cityName, emoji, date,id, position } = city;
  const countryCode = emoji?.length === 2 && /^[A-Z]{2}$/.test(emoji) ? emoji  : flagEmojiToCountryCode(emoji);

  function handleClick(e){
    e.preventDefault();
    deleteCity(id);
  }
  return (
    <Link className={`${styles.cityItem} ${id===currentCity.id ? styles['cityItem--active']:""}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
      <span className={styles.emoji}>{countryCode ? (
            <img
                src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                alt={`${cityName} flag`}
                width="24"
                height="18"
                style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            ) : (
            <span>🏳️</span> // fallback emoji if conversion fails
            )}
     </span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>{formatDate(date)}</time>
      <button className={styles.deleteBtn} onClick={handleClick}>&times;</button>
    </Link>
  );
}
