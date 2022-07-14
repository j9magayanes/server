CREATE TABLE reviews (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES models(id),
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL check(
        rating >= 1
        and rating <= 5
    )
);
select *
from model
    left join(
        select model_id,
            count(*),
            TRUNC(AVG(rating, 1)) as average_rating
        from reviews
        group by model_id
    ) reviews on models.id = reviews.model_id;