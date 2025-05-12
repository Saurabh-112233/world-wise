import {  useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCity } from "../context/CitiesContext";
import { useEffect } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

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
    weekday: "long",
  }).format(new Date(date));

function City() {

  const {id} = useParams();
  const {getCity,currentCity,isLoading} = useCity()

  useEffect(function(){
    getCity(id);
  },[id,getCity])
  if(isLoading) return <Spinner /> 
  const {cityName, emoji, date, notes} = currentCity;
  const countryCode =
  emoji?.length === 2 && /^[A-Z]{2}$/.test(emoji)
    ? emoji
    : flagEmojiToCountryCode(emoji);
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{countryCode ? (
            <img
                src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
                alt={`${cityName} flag`}
                width="24"
                height="18"
                style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            ) : (
            <span>🏳️</span> // fallback emoji if conversion fails
            )}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
