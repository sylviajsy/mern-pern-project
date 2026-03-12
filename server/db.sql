--
-- PostgreSQL database dump
--

\restrict EaU8MbMWJEFmZ9B5AvmBSU8EfjXVYQY2FQiV0tzjX2mXEVHFr5kb7DJKqw4qIYP

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: individuals; Type: TABLE; Schema: public; Owner: techtonica
--

CREATE TABLE public.individuals (
    id integer NOT NULL,
    nickname character varying(255),
    species_id integer,
    scientist_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    wikipedia_url text,
    photo_url text
);


ALTER TABLE public.individuals OWNER TO techtonica;

--
-- Name: individuals_id_seq; Type: SEQUENCE; Schema: public; Owner: techtonica
--

CREATE SEQUENCE public.individuals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.individuals_id_seq OWNER TO techtonica;

--
-- Name: individuals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: techtonica
--

ALTER SEQUENCE public.individuals_id_seq OWNED BY public.individuals.id;


--
-- Name: sighting_individuals; Type: TABLE; Schema: public; Owner: techtonica
--

CREATE TABLE public.sighting_individuals (
    id integer NOT NULL,
    sighting_id integer NOT NULL,
    individual_id integer NOT NULL
);


ALTER TABLE public.sighting_individuals OWNER TO techtonica;

--
-- Name: sighting_individuals_id_seq; Type: SEQUENCE; Schema: public; Owner: techtonica
--

CREATE SEQUENCE public.sighting_individuals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sighting_individuals_id_seq OWNER TO techtonica;

--
-- Name: sighting_individuals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: techtonica
--

ALTER SEQUENCE public.sighting_individuals_id_seq OWNED BY public.sighting_individuals.id;


--
-- Name: sightings; Type: TABLE; Schema: public; Owner: techtonica
--

CREATE TABLE public.sightings (
    id integer NOT NULL,
    sighting_time timestamp without time zone NOT NULL,
    individual_id integer,
    location text NOT NULL,
    is_healthy boolean DEFAULT true,
    sighter_email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sightings OWNER TO techtonica;

--
-- Name: sightings_id_seq; Type: SEQUENCE; Schema: public; Owner: techtonica
--

CREATE SEQUENCE public.sightings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sightings_id_seq OWNER TO techtonica;

--
-- Name: sightings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: techtonica
--

ALTER SEQUENCE public.sightings_id_seq OWNED BY public.sightings.id;


--
-- Name: species; Type: TABLE; Schema: public; Owner: techtonica
--

CREATE TABLE public.species (
    id integer NOT NULL,
    common_name character varying(255) NOT NULL,
    scientific_name character varying(255) NOT NULL,
    estimated_wild_count integer,
    conservation_status_code character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.species OWNER TO techtonica;

--
-- Name: species_id_seq; Type: SEQUENCE; Schema: public; Owner: techtonica
--

CREATE SEQUENCE public.species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.species_id_seq OWNER TO techtonica;

--
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: techtonica
--

ALTER SEQUENCE public.species_id_seq OWNED BY public.species.id;


--
-- Name: individuals id; Type: DEFAULT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.individuals ALTER COLUMN id SET DEFAULT nextval('public.individuals_id_seq'::regclass);


--
-- Name: sighting_individuals id; Type: DEFAULT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sighting_individuals ALTER COLUMN id SET DEFAULT nextval('public.sighting_individuals_id_seq'::regclass);


--
-- Name: sightings id; Type: DEFAULT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sightings ALTER COLUMN id SET DEFAULT nextval('public.sightings_id_seq'::regclass);


--
-- Name: species id; Type: DEFAULT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.species ALTER COLUMN id SET DEFAULT nextval('public.species_id_seq'::regclass);


--
-- Data for Name: individuals; Type: TABLE DATA; Schema: public; Owner: techtonica
--

COPY public.individuals (id, nickname, species_id, scientist_name, created_at, wikipedia_url, photo_url) FROM stdin;
1	Prickly Petunia	1	Dr. Smith	2026-03-03 13:54:22.818499	\N	\N
2	Tony	1	Dr. Jones	2026-03-03 13:54:22.818499	\N	\N
3	Simba	2	Dr. Mufasa	2026-03-03 13:54:22.818499	\N	\N
4	Nala	2	Dr. Mufasa	2026-03-03 13:54:22.818499	\N	\N
6	Mei Xiang	3	Dr. Li	2026-03-03 13:54:22.818499	\N	\N
5	Bao Bao	3	Dr. Li	2026-03-03 13:54:22.818499	https://en.wikipedia.org/wiki/Giant_panda	https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG
\.


--
-- Data for Name: sighting_individuals; Type: TABLE DATA; Schema: public; Owner: techtonica
--

COPY public.sighting_individuals (id, sighting_id, individual_id) FROM stdin;
1	1	1
2	2	1
3	3	2
4	4	3
5	5	3
6	6	3
7	7	4
8	8	5
9	9	5
10	10	6
20	22	5
21	22	6
\.


--
-- Data for Name: sightings; Type: TABLE DATA; Schema: public; Owner: techtonica
--

COPY public.sightings (id, sighting_time, individual_id, location, is_healthy, sighter_email, created_at) FROM stdin;
1	2024-03-01 08:00:00	1	37.791278, -122.394680	t	smith@research.org	2026-03-03 14:31:40.90016
2	2024-03-10 14:20:00	1	Yellowstone North Gate	t	ranger_joe@park.gov	2026-03-03 14:31:40.90016
3	2024-03-02 11:30:00	2	California	t	contact@wildlife.ca	2026-03-03 14:31:40.90016
4	2024-03-03 09:15:00	3	34.052235, -118.243683	t	mufasa@savannah.res	2026-03-03 14:31:40.90016
5	2024-03-12 18:45:00	3	Serengeti East Plain	f	vet_team@savannah.res	2026-03-03 14:31:40.90016
6	2024-03-20 06:00:00	3	Masai Mara South	t	mufasa@savannah.res	2026-03-03 14:31:40.90016
7	2024-03-04 16:00:00	4	Kenya	t	safari_guide@nature.com	2026-03-03 14:31:40.90016
8	2024-03-05 10:00:00	5	30.5728, 104.0668	t	li@panda_base.cn	2026-03-03 14:31:40.90016
9	2024-03-15 13:00:00	5	Sichuan Wolong Reserve	t	li@panda_base.cn	2026-03-03 14:31:40.90016
10	2024-03-06 08:30:00	6	Chengdu Research Base	t	panda_fan@gmail.com	2026-03-03 14:31:40.90016
16	2026-03-10 21:22:00	\N	SiChuan Wolong Reserve	t	sylviajsyy@gmail.com	2026-03-10 21:22:46.695542
17	2026-03-10 21:36:00	\N	SiChuan Wolong Reserve	t	sylviajsyy@gmail.com	2026-03-10 21:36:57.643883
22	2026-03-10 23:20:00	\N	SiChuan Wolong Reserve	t	sylviajsy@outlook.com	2026-03-10 23:20:47.969349
\.


--
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: techtonica
--

COPY public.species (id, common_name, scientific_name, estimated_wild_count, conservation_status_code, created_at) FROM stdin;
1	Tiger	Panthera tigris	3900	E	2026-03-03 13:52:54.652051
2	Lion	Panthera leo	20000	T	2026-03-03 13:52:54.652051
3	Giant Panda	Ailuropoda melanoleuca	1864	T	2026-03-03 13:52:54.652051
\.


--
-- Name: individuals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: techtonica
--

SELECT pg_catalog.setval('public.individuals_id_seq', 20, true);


--
-- Name: sighting_individuals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: techtonica
--

SELECT pg_catalog.setval('public.sighting_individuals_id_seq', 21, true);


--
-- Name: sightings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: techtonica
--

SELECT pg_catalog.setval('public.sightings_id_seq', 22, true);


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: techtonica
--

SELECT pg_catalog.setval('public.species_id_seq', 3, true);


--
-- Name: individuals individuals_pkey; Type: CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.individuals
    ADD CONSTRAINT individuals_pkey PRIMARY KEY (id);


--
-- Name: sighting_individuals sighting_individuals_pkey; Type: CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sighting_individuals
    ADD CONSTRAINT sighting_individuals_pkey PRIMARY KEY (id);


--
-- Name: sighting_individuals sighting_individuals_sighting_id_individual_id_key; Type: CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sighting_individuals
    ADD CONSTRAINT sighting_individuals_sighting_id_individual_id_key UNIQUE (sighting_id, individual_id);


--
-- Name: sightings sightings_pkey; Type: CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sightings
    ADD CONSTRAINT sightings_pkey PRIMARY KEY (id);


--
-- Name: species species_pkey; Type: CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: individuals individuals_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.individuals
    ADD CONSTRAINT individuals_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(id) ON DELETE CASCADE;


--
-- Name: sighting_individuals sighting_individuals_individual_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sighting_individuals
    ADD CONSTRAINT sighting_individuals_individual_id_fkey FOREIGN KEY (individual_id) REFERENCES public.individuals(id) ON DELETE CASCADE;


--
-- Name: sighting_individuals sighting_individuals_sighting_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sighting_individuals
    ADD CONSTRAINT sighting_individuals_sighting_id_fkey FOREIGN KEY (sighting_id) REFERENCES public.sightings(id) ON DELETE CASCADE;


--
-- Name: sightings sightings_individual_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: techtonica
--

ALTER TABLE ONLY public.sightings
    ADD CONSTRAINT sightings_individual_id_fkey FOREIGN KEY (individual_id) REFERENCES public.individuals(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict EaU8MbMWJEFmZ9B5AvmBSU8EfjXVYQY2FQiV0tzjX2mXEVHFr5kb7DJKqw4qIYP

