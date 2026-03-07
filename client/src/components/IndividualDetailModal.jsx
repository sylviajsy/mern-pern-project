import React from 'react'
import "../scss/IndividualDetailModal.scss"

const IndividualDetailModal = ({ individual }) => {
    console.log("Current individual object:", individual);
  return (
    <div>
            <h3>{individual.nickname}</h3>
            <p><strong>Species:</strong> {individual.species}</p>

            {individual.photo_url && (
                <img
                    src={individual.photo_url}
                    alt={individual.nickname}
                    className="individual-photo"
                />
            )}

            {individual.wikipedia_url ? (
                <p>
                    <strong>Wikipedia:</strong>{" "}
                    <a
                        href={individual.wikipedia_url}
                        target="_blank"
                    >
                        Open Wikipedia Page
                    </a>
                </p>
                ) : (
                <p><strong>Wikipedia:</strong> Not available</p>
            )}
        </div>
  )
}

export default IndividualDetailModal
