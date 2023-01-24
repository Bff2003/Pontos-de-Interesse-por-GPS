create table if not exists pontoDeInteresse (
  id INTEGER PRIMARY KEY,
  nome varchar(255) not null unique,
  descricao varchar(255),
  latitude decimal(10,8) not null,
  longitude decimal(11,8) not null
);

drop table if exists pontoDeInteresse;
