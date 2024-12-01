create table rooms
(
    id          uuid primary key         default gen_random_uuid(),
    name        varchar(255) not null,
    description text,
    created_at  timestamp with time zone default now(),

    unique (name)
);

create table rounds
(
    id           uuid primary key         default gen_random_uuid(),
    round_number integer not null,
    room_id      uuid references rooms (id),
    created_at   timestamp with time zone default now(),
    finished_at  timestamp with time zone,

    unique (round_number, room_id)
);

create table players
(
    id         uuid primary key         default gen_random_uuid(),
    name       varchar(255) not null,
    room_id    uuid references rooms (id),
    created_at timestamp with time zone default now(),

    unique (name, room_id)
);

create table matches
(
    id            uuid primary key         default gen_random_uuid(),
    round_id      uuid references rounds (id),
    player1_id    uuid references players (id),
    player2_id    uuid references players (id),
    player1_score integer,
    player2_score integer,
    created_at    timestamp with time zone default now(),
    finished_at   timestamp with time zone
);
