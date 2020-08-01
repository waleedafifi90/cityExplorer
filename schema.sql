drop table if EXISTS location;
drop table if EXISTS weather;
drop table if EXISTS trails;

create table location (
    id serial primary key ,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude VARCHAR(255),
    longitude VARCHAR(255),
    country_code VARCHAR(255)
);

create table weather (
    id serial primary key ,
    forecast VARCHAR(255),
    time VARCHAR(255),
    location_id VARCHAR(255)
);

create table trails (
    id serial primary key ,
    name VARCHAR(255),
    length VARCHAR(255),
    stars VARCHAR(255),
    star_votes VARCHAR(255),
    summary VARCHAR(255),
    trail_url VARCHAR(255),
    conditions VARCHAR(255),
    condition_date VARCHAR(255),
    condition_time VARCHAR(255)
);