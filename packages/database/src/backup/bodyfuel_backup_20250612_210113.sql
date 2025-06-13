--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'SHIPPED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."Cart" (
    id integer NOT NULL,
    "sessionId" text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cart" OWNER TO dennis;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."CartItem" (
    id integer NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "variantId" integer
);


ALTER TABLE public."CartItem" OWNER TO dennis;

--
-- Name: CartItem_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public."CartItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CartItem_id_seq" OWNER TO dennis;

--
-- Name: CartItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public."CartItem_id_seq" OWNED BY public."CartItem".id;


--
-- Name: Cart_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cart_id_seq" OWNER TO dennis;

--
-- Name: Cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public."Cart_id_seq" OWNED BY public."Cart".id;


--
-- Name: Collection; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."Collection" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    is_demo boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parentId" integer
);


ALTER TABLE public."Collection" OWNER TO dennis;

--
-- Name: Collection_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public."Collection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Collection_id_seq" OWNER TO dennis;

--
-- Name: Collection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public."Collection_id_seq" OWNED BY public."Collection".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" integer NOT NULL,
    "userId" text,
    email text NOT NULL,
    total double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "shippingInfoId" text,
    "shippingMethod" text,
    "shippingCost" double precision,
    "estimatedDelivery" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    is_demo boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Order" OWNER TO dennis;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" text NOT NULL,
    "productId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO dennis;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItem_id_seq" OWNER TO dennis;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_orderNumber_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public."Order_orderNumber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_orderNumber_seq" OWNER TO dennis;

--
-- Name: Order_orderNumber_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public."Order_orderNumber_seq" OWNED BY public."Order"."orderNumber";


--
-- Name: ShippingInfo; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."ShippingInfo" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    company text,
    address text NOT NULL,
    apartment text,
    city text NOT NULL,
    state text,
    "postalCode" text NOT NULL,
    "countryId" integer NOT NULL,
    phone text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ShippingInfo" OWNER TO dennis;

--
-- Name: _CollectionToProduct; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public."_CollectionToProduct" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_CollectionToProduct" OWNER TO dennis;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO dennis;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO dennis;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO dennis;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO dennis;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "isShippingAvailable" boolean DEFAULT true NOT NULL,
    "displayOrder" integer DEFAULT 999 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.countries OWNER TO dennis;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO dennis;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    "imageKey" text NOT NULL,
    "productId" integer NOT NULL
);


ALTER TABLE public.product_images OWNER TO dennis;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO dennis;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: product_option_values; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.product_option_values (
    id integer NOT NULL,
    value text NOT NULL,
    "optionId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_option_values OWNER TO dennis;

--
-- Name: product_option_values_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.product_option_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_option_values_id_seq OWNER TO dennis;

--
-- Name: product_option_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.product_option_values_id_seq OWNED BY public.product_option_values.id;


--
-- Name: product_options; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.product_options (
    id integer NOT NULL,
    name text NOT NULL,
    "productId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_options OWNER TO dennis;

--
-- Name: product_options_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.product_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_options_id_seq OWNER TO dennis;

--
-- Name: product_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.product_options_id_seq OWNED BY public.product_options.id;


--
-- Name: product_variant_option_values; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.product_variant_option_values (
    id integer NOT NULL,
    "variantId" integer NOT NULL,
    "optionValueId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_variant_option_values OWNER TO dennis;

--
-- Name: product_variant_option_values_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.product_variant_option_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variant_option_values_id_seq OWNER TO dennis;

--
-- Name: product_variant_option_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.product_variant_option_values_id_seq OWNED BY public.product_variant_option_values.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    price double precision NOT NULL,
    stock integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_variants OWNER TO dennis;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variants_id_seq OWNER TO dennis;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    sku text,
    description text,
    brand text,
    "categoryId" integer NOT NULL,
    price double precision NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    is_demo boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO dennis;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: dennis
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO dennis;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dennis
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    session_token text NOT NULL,
    user_id text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO dennis;

--
-- Name: users; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text,
    email_verified timestamp(3) without time zone,
    image text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    password text
);


ALTER TABLE public.users OWNER TO dennis;

--
-- Name: verificationtokens; Type: TABLE; Schema: public; Owner: dennis
--

CREATE TABLE public.verificationtokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verificationtokens OWNER TO dennis;

--
-- Name: Cart id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Cart" ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);


--
-- Name: CartItem id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."CartItem" ALTER COLUMN id SET DEFAULT nextval('public."CartItem_id_seq"'::regclass);


--
-- Name: Collection id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Collection" ALTER COLUMN id SET DEFAULT nextval('public."Collection_id_seq"'::regclass);


--
-- Name: Order orderNumber; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Order" ALTER COLUMN "orderNumber" SET DEFAULT nextval('public."Order_orderNumber_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: product_option_values id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_option_values ALTER COLUMN id SET DEFAULT nextval('public.product_option_values_id_seq'::regclass);


--
-- Name: product_options id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_options ALTER COLUMN id SET DEFAULT nextval('public.product_options_id_seq'::regclass);


--
-- Name: product_variant_option_values id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variant_option_values ALTER COLUMN id SET DEFAULT nextval('public.product_variant_option_values_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."Cart" (id, "sessionId", "userId", "createdAt", "updatedAt") FROM stdin;
1	dc9275e3-ab37-4df3-93db-58f35ba6387e	\N	2025-06-06 18:46:40.743	2025-06-06 18:46:40.743
2	0008f320-bc84-4274-98ac-d2fb271ee98c	\N	2025-06-07 07:20:31.955	2025-06-07 07:20:31.955
3	e2081a55-9ae7-4b73-8e95-6c9ede35d8ac	\N	2025-06-07 08:15:28.904	2025-06-07 08:15:28.904
4	d0e2e72b-6593-4639-a347-76e1db22ca83	\N	2025-06-07 16:20:40.436	2025-06-07 16:20:40.436
5	78b235fd-5e89-495e-baeb-2aee552ba88e	\N	2025-06-08 09:45:35.12	2025-06-08 09:45:35.12
6	d5288504-557c-4e17-b92d-da7f49a4e375	\N	2025-06-08 09:47:47.566	2025-06-08 09:47:47.566
7	1e0f4215-3c78-43d1-a894-0ed26ec004c6	\N	2025-06-08 15:30:32.231	2025-06-08 15:30:32.231
8	07727a47-cdf0-4b96-b7a7-e220100c95d3	\N	2025-06-09 17:46:26.48	2025-06-09 17:46:26.48
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."CartItem" (id, "cartId", "productId", quantity, price, "createdAt", "updatedAt", "variantId") FROM stdin;
29	2	22	3	59.99	2025-06-07 07:21:36.499	2025-06-07 07:21:36.499	43
30	2	22	2	99.99	2025-06-07 07:21:44.312	2025-06-07 07:21:44.312	44
46	4	22	1	59.99	2025-06-07 16:20:46.98	2025-06-07 16:20:46.98	43
49	1	8	1	29.99	2025-06-07 16:43:37.766	2025-06-07 16:43:37.766	15
50	1	14	3	39.99	2025-06-07 16:43:43.186	2025-06-07 16:43:43.186	27
51	1	30	1	74.99	2025-06-07 16:43:49.725	2025-06-07 16:43:49.725	60
48	1	1	2	29.99	2025-06-07 16:43:34.188	2025-06-07 16:47:47.207	1
52	1	7	1	39.99	2025-06-07 18:15:11.77	2025-06-07 18:15:11.77	14
53	1	3	2	27.99	2025-06-07 18:15:27.997	2025-06-07 19:25:12.392	5
54	1	1	1	39.99	2025-06-07 19:33:32.828	2025-06-07 19:33:32.828	2
55	6	9	1	19.99	2025-06-08 10:00:13.448	2025-06-08 10:00:13.448	17
56	6	22	1	99.99	2025-06-08 10:58:34.592	2025-06-08 10:58:34.592	44
57	8	19	1	49.99	2025-06-10 12:17:00.264	2025-06-10 12:17:00.264	37
58	8	46	1	35	2025-06-12 17:51:55.254	2025-06-12 17:51:55.254	\N
\.


--
-- Data for Name: Collection; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."Collection" (id, name, slug, description, is_demo, "createdAt", "updatedAt", "parentId") FROM stdin;
1	New Arrivals	new-arrivals	Our latest products and innovations	t	2025-05-21 17:33:18.535	2025-05-21 17:33:18.535	\N
2	Best Sellers	best-sellers	Most popular products loved by our customers	t	2025-05-21 17:33:18.538	2025-05-21 17:33:18.538	\N
3	Sale Items	sale-items	Special discounts and promotions	t	2025-05-21 17:33:18.539	2025-05-21 17:33:18.539	\N
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."Order" (id, "orderNumber", "userId", email, total, status, "shippingInfoId", "shippingMethod", "shippingCost", "estimatedDelivery", "createdAt", "updatedAt", is_demo) FROM stdin;
4aab4e68-f56d-4d6d-92d1-378e18d45ccd	1	cmbm3o61e0000zgb2mxbg7sey	admin@example.com	284.93	PENDING	08a723ea-bdad-47d7-8a04-57a0141be189	\N	\N	\N	2025-06-07 17:55:43.151	2025-06-07 18:17:36.931	t
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price, "createdAt", "updatedAt") FROM stdin;
11	4aab4e68-f56d-4d6d-92d1-378e18d45ccd	30	1	74.99	2025-06-07 17:55:43.151	2025-06-07 17:55:43.151
12	4aab4e68-f56d-4d6d-92d1-378e18d45ccd	14	3	39.99	2025-06-07 17:55:43.151	2025-06-07 17:55:43.151
13	4aab4e68-f56d-4d6d-92d1-378e18d45ccd	8	1	29.99	2025-06-07 17:55:43.151	2025-06-07 17:55:43.151
14	4aab4e68-f56d-4d6d-92d1-378e18d45ccd	1	2	29.99	2025-06-07 17:55:43.151	2025-06-07 17:55:43.151
\.


--
-- Data for Name: ShippingInfo; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."ShippingInfo" (id, "firstName", "lastName", company, address, apartment, city, state, "postalCode", "countryId", phone, "createdAt", "updatedAt") FROM stdin;
b3e08b8e-f073-418f-86f8-09aa11eeabc9	Michael	Johnson	CrossFit Austin	789 Fitness Boulevard	Unit 12	Austin	Texas	78704	237	(512) 555-7890	2025-06-07 17:38:09.4	2025-06-07 17:38:09.4
08a723ea-bdad-47d7-8a04-57a0141be189	John	Doe	Acme Corp	123 Main Street	Apt 4B	New York	NY	10001	237	555) 123-4567	2025-06-07 17:55:43.151	2025-06-07 17:55:43.151
\.


--
-- Data for Name: _CollectionToProduct; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public."_CollectionToProduct" ("A", "B") FROM stdin;
2	14
2	10
2	3
3	9
3	22
3	33
3	35
1	2
1	3
2	16
1	20
1	7
2	2
2	12
2	18
2	19
3	37
3	39
3	41
1	46
1	48
1	47
1	44
3	44
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
788cd629-bc8b-44f6-9108-564cf8816bb4	74ef4d44054c3feeff853b83268c37cc2e3ee1d8f019e14cdc768a6e4fc90cc6	2025-05-21 20:11:11.406163+03	20250521153207_init	\N	\N	2025-05-21 20:11:11.379626+03	1
1e1c48e9-d0d0-41a4-b14f-e8e70a5edaf7	a78e85b1b1d6a4d09f319403047aa12fd5a32cb862f440c2a6c2363ff5346a3d	2025-06-07 07:48:56.909393+03	20250607044856_add_variant_support_to_cart_items	\N	\N	2025-06-07 07:48:56.90415+03	1
56c097de-1ce6-48cb-9991-8e940386b8dc	37627726838d5ffebd672e926d9b9cdcccf5284a610c85b1d7a62daaab21586b	2025-06-07 19:42:11.215219+03	20250607164210_add_is_demo_to_order	\N	\N	2025-06-07 19:42:11.213404+03	1
68a8a827-3be8-4b9b-bb2c-6d674ef20d30	3c8cb3b7817c0c55dced69626d04b6006998bc8e84c209c98f123d24bd01f645	2025-06-07 20:59:27.052785+03	20250607175926_set_is_demo_default_value_to_false	\N	\N	2025-06-07 20:59:27.050708+03	1
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.categories (id, name, slug, description, "createdAt", "updatedAt") FROM stdin;
1	Pre-Workout	pre-workout	Boost your energy before exercise	2025-05-21 17:33:15.249	2025-05-21 17:33:15.249
2	Post-Workout	post-workout	Support recovery after training	2025-05-21 17:33:15.251	2025-05-21 17:33:15.251
3	Vitamins	vitamins	Essential vitamins and minerals	2025-05-21 17:33:15.252	2025-05-21 17:33:15.252
4	Fat Burners	fat-burners	Support your weight management goals	2025-05-21 17:33:15.253	2025-05-21 17:33:15.253
5	Protein Powders	protein-powders	High-quality protein supplements	2025-05-21 17:33:15.253	2025-05-21 17:33:15.253
6	Creatine	creatine	Enhance strength and muscle performance	2025-05-21 17:33:15.254	2025-05-21 17:33:15.254
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.countries (id, code, name, "isShippingAvailable", "displayOrder", "createdAt", "updatedAt") FROM stdin;
1	AF	Afghanistan	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
2	AX	Åland Islands	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
3	AL	Albania	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
4	DZ	Algeria	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
5	AS	American Samoa	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
6	AD	Andorra	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
7	AO	Angola	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
8	AI	Anguilla	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
9	AQ	Antarctica	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
10	AG	Antigua and Barbuda	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
11	AR	Argentina	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
12	AM	Armenia	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
13	AW	Aruba	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
14	AU	Australia	t	18	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
15	AT	Austria	t	23	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
16	AZ	Azerbaijan	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
17	BS	Bahamas	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
18	BH	Bahrain	t	9	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
19	BD	Bangladesh	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
20	BB	Barbados	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
21	BY	Belarus	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
22	BE	Belgium	t	22	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
23	BZ	Belize	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
24	BJ	Benin	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
25	BM	Bermuda	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
26	BT	Bhutan	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
27	BO	Bolivia	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
28	BA	Bosnia and Herzegovina	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
29	BW	Botswana	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
30	BV	Bouvet Island	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
31	BR	Brazil	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
32	IO	British Indian Ocean Territory	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
33	VG	British Virgin Islands	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
34	BN	Brunei	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
35	BG	Bulgaria	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
36	BF	Burkina Faso	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
37	BI	Burundi	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
38	KH	Cambodia	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
39	CM	Cameroon	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
40	CA	Canada	t	17	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
41	CV	Cape Verde	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
42	BQ	Caribbean Netherlands	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
43	KY	Cayman Islands	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
44	CF	Central African Republic	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
45	TD	Chad	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
46	CL	Chile	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
47	CN	China	t	13	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
48	CX	Christmas Island	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
49	CC	Cocos (Keeling) Islands	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
50	CO	Colombia	t	100	2025-05-21 17:33:08.433	2025-05-21 17:33:08.433
51	KM	Comoros	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
52	CK	Cook Islands	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
53	CR	Costa Rica	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
54	HR	Croatia	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
55	CU	Cuba	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
56	CW	Curaçao	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
57	CY	Cyprus	t	27	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
58	CZ	Czechia	t	25	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
59	DK	Denmark	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
60	DJ	Djibouti	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
61	DM	Dominica	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
62	DO	Dominican Republic	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
63	CD	DR Congo	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
64	EC	Ecuador	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
65	EG	Egypt	t	11	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
66	SV	El Salvador	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
67	GQ	Equatorial Guinea	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
68	ER	Eritrea	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
69	EE	Estonia	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
70	SZ	Eswatini	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
71	ET	Ethiopia	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
72	FK	Falkland Islands	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
73	FO	Faroe Islands	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
74	FJ	Fiji	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
75	FI	Finland	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
76	FR	France	t	5	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
77	GF	French Guiana	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
78	PF	French Polynesia	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
79	TF	French Southern and Antarctic Lands	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
80	GA	Gabon	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
81	GM	Gambia	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
82	GE	Georgia	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
83	DE	Germany	t	4	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
84	GH	Ghana	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
85	GI	Gibraltar	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
86	GR	Greece	t	26	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
87	GL	Greenland	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
88	GD	Grenada	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
89	GP	Guadeloupe	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
90	GU	Guam	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
91	GT	Guatemala	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
92	GG	Guernsey	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
93	GN	Guinea	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
94	GW	Guinea-Bissau	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
95	GY	Guyana	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
96	HT	Haiti	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
97	HM	Heard Island and McDonald Islands	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
98	HN	Honduras	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
99	HK	Hong Kong	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
100	HU	Hungary	t	100	2025-05-21 17:33:08.453	2025-05-21 17:33:08.453
101	IS	Iceland	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
102	IN	India	t	14	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
103	ID	Indonesia	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
104	IR	Iran	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
105	IQ	Iraq	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
106	IE	Ireland	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
107	IM	Isle of Man	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
108	IL	Israel	t	1	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
109	IT	Italy	t	6	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
110	CI	Ivory Coast	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
111	JM	Jamaica	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
112	JP	Japan	t	15	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
113	JE	Jersey	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
114	JO	Jordan	t	12	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
115	KZ	Kazakhstan	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
116	KE	Kenya	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
117	KI	Kiribati	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
118	XK	Kosovo	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
119	KW	Kuwait	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
120	KG	Kyrgyzstan	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
121	LA	Laos	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
122	LV	Latvia	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
123	LB	Lebanon	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
124	LS	Lesotho	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
125	LR	Liberia	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
126	LY	Libya	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
127	LI	Liechtenstein	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
128	LT	Lithuania	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
129	LU	Luxembourg	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
130	MO	Macau	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
131	MG	Madagascar	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
132	MW	Malawi	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
133	MY	Malaysia	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
134	MV	Maldives	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
135	ML	Mali	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
136	MT	Malta	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
137	MH	Marshall Islands	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
138	MQ	Martinique	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
139	MR	Mauritania	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
140	MU	Mauritius	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
141	YT	Mayotte	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
142	MX	Mexico	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
143	FM	Micronesia	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
144	MD	Moldova	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
145	MC	Monaco	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
146	MN	Mongolia	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
147	ME	Montenegro	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
148	MS	Montserrat	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
149	MA	Morocco	t	10	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
150	MZ	Mozambique	t	100	2025-05-21 17:33:08.466	2025-05-21 17:33:08.466
151	MM	Myanmar	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
152	NA	Namibia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
153	NR	Nauru	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
154	NP	Nepal	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
155	NL	Netherlands	t	7	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
156	NC	New Caledonia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
157	NZ	New Zealand	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
158	NI	Nicaragua	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
159	NE	Niger	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
160	NG	Nigeria	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
161	NU	Niue	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
162	NF	Norfolk Island	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
163	KP	North Korea	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
164	MK	North Macedonia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
165	MP	Northern Mariana Islands	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
166	NO	Norway	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
167	OM	Oman	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
168	PK	Pakistan	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
169	PW	Palau	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
170	PS	Palestine	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
171	PA	Panama	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
172	PG	Papua New Guinea	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
173	PY	Paraguay	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
174	PE	Peru	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
175	PH	Philippines	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
176	PN	Pitcairn Islands	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
177	PL	Poland	t	24	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
178	PT	Portugal	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
179	PR	Puerto Rico	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
180	QA	Qatar	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
181	CG	Republic of the Congo	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
182	RE	Réunion	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
183	RO	Romania	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
184	RU	Russia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
185	RW	Rwanda	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
186	BL	Saint Barthélemy	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
187	SH	Saint Helena, Ascension and Tristan da Cunha	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
188	KN	Saint Kitts and Nevis	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
189	LC	Saint Lucia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
190	MF	Saint Martin	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
191	PM	Saint Pierre and Miquelon	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
192	VC	Saint Vincent and the Grenadines	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
193	WS	Samoa	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
194	SM	San Marino	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
195	ST	São Tomé and Príncipe	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
196	SA	Saudi Arabia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
197	SN	Senegal	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
198	RS	Serbia	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
199	SC	Seychelles	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
200	SL	Sierra Leone	t	100	2025-05-21 17:33:08.478	2025-05-21 17:33:08.478
201	SG	Singapore	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
202	SX	Sint Maarten	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
203	SK	Slovakia	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
204	SI	Slovenia	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
205	SB	Solomon Islands	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
206	SO	Somalia	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
207	ZA	South Africa	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
208	GS	South Georgia	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
209	KR	South Korea	t	16	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
210	SS	South Sudan	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
211	ES	Spain	t	19	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
212	LK	Sri Lanka	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
213	SD	Sudan	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
214	SR	Suriname	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
215	SJ	Svalbard and Jan Mayen	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
216	SE	Sweden	t	21	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
217	CH	Switzerland	t	20	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
218	SY	Syria	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
219	TW	Taiwan	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
220	TJ	Tajikistan	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
221	TZ	Tanzania	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
222	TH	Thailand	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
223	TL	Timor-Leste	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
224	TG	Togo	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
225	TK	Tokelau	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
226	TO	Tonga	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
227	TT	Trinidad and Tobago	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
228	TN	Tunisia	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
229	TR	Turkey	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
230	TM	Turkmenistan	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
231	TC	Turks and Caicos Islands	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
232	TV	Tuvalu	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
233	UG	Uganda	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
234	UA	Ukraine	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
235	AE	United Arab Emirates	t	8	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
236	GB	United Kingdom	t	3	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
237	US	United States	t	2	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
238	UM	United States Minor Outlying Islands	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
239	VI	United States Virgin Islands	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
240	UY	Uruguay	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
241	UZ	Uzbekistan	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
242	VU	Vanuatu	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
243	VA	Vatican City	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
244	VE	Venezuela	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
245	VN	Vietnam	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
246	WF	Wallis and Futuna	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
247	EH	Western Sahara	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
248	YE	Yemen	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
249	ZM	Zambia	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
250	ZW	Zimbabwe	t	100	2025-05-21 17:33:08.491	2025-05-21 17:33:08.491
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.product_images (id, "imageKey", "productId") FROM stdin;
1	products/1741870461748--blackstone-labs-creatine-monohydrate.webp	1
2	products/1741870472596--con-cret-creatine-hcl.webp	2
3	products/1741870484618--efx-sports-kre-alkalyn-capsules-powders.webp	3
4	products/1741870498354--hpn-c2-creapure-creatine-hpnc.webp	4
5	products/1741870507640--kodagenix-creatine-monohydrate.webp	5
6	products/1741870515414--pro-supps-creatine.webp	6
7	products/1747830177075--100Whey.webp	7
8	products/1741870415640--Creatine1.webp	8
9	products/1741870432133--Glutamine.webp	9
10	products/1741870361379--core-orange-cream-iso-clear-tf.webp	10
11	products/1741870372825--efx-sports-karbolyn-fuel.webp	11
12	products/1741870444105--purus_labs_zm.webp	12
13	products/1741870222540--Outrage-LL-FR.webp	13
14	products/1741870154453--alpha-lion-superhuman-pump.webp	14
15	products/1745818866011--blackstone-labs-hype-reloaded.webp	15
16	products/1741870309582--bucked-up-bucked-up.webp	16
17	products/1741870320323--pump-chasers-pump-n-grind-explosive-pre-workout-formula.webp	17
18	products/1741870335652--puruslabsdpolpowderlemonadenewimage.webp	18
19	products/1741870528260--bcaa-xplode-protein.jpg	19
20	products/1741870558795--gold-standard-casein-protein.jpg	20
21	products/1741870568938--mb-proteins.jpg	21
22	products/1741870580937--olimp-gold-gainer.jpg	22
23	products/1741870631105--olimp-gold-protein.jpg	23
24	products/1745818790455--ancient-nutrition-ancient-nutrients-mens-multi-once-daily-multi.webp	24
25	products/1741870643275--blackstone-labs-liposomal-vitamin-d3.webp	25
26	products/1741870683479--core-nutritionals-core-multi.webp	26
27	products/1745818684782--inspired-nutraceuticals-vegan-multivitamin.webp	27
28	products/1745818778769--legion-vitamin-dk.webp	28
29	products/1741870664952--now-foods-vitamin-b.webp	29
30	products/1741870698851--Cognisport.webp	30
31	products/1741870708121--Tribulus.webp	31
32	products/1741871795823--blackstone-labs-liposomal-vitamin-c.webp	32
33	products/1741870719005--bodybio-calcium-magnesium-butyrate.webp	33
34	products/1741870728678--mts-nutrition-mts-fish-oil-omega-3.webp	34
35	products/1741870739810--nuethix-bloat-eaze-pro.webp	35
36	products/1749748258099--mutant-creakong-advanced-creatine-multiplier.webp	36
37	products/1749749575568--abe-creatine.webp	37
38	products/1749749655105--5-nutrition-5-nutrition-l-glutamine.webp	38
39	products/1749749694414--alri-humaprowebp.webp	39
40	products/1749749840771--bucked-up-woke-af-high-stimulant-pre-workout.webp	40
41	products/1749749880366--riptx-pre-workout.jpg	41
42	products/1749749942458--panda-supplements-fuel-premium-protein.webp	42
43	products/1749750059905--redcon1-mre-meal-replacement.webp	43
44	products/1749750110498--mutant-multi-high-potency-daily-formula.webp	44
45	products/1749750147327--panda-panda-greens-natural-superfoods.webp	45
46	products/1749750200280--applied-nutrition-shred-x-thermogenic-powder.webp	46
47	products/1749750228416--bucked-up-lfg-burn-thermogenic-pre-workout.webp	47
48	products/1749750416941--ssa-protein.jpg	48
\.


--
-- Data for Name: product_option_values; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.product_option_values (id, value, "optionId", "createdAt", "updatedAt") FROM stdin;
1	300g	1	2025-05-21 17:33:23.229	2025-05-21 17:33:23.229
2	500g	1	2025-05-21 17:33:23.231	2025-05-21 17:33:23.231
3	Standard	2	2025-05-21 17:33:23.237	2025-05-21 17:33:23.237
4	Large	2	2025-05-21 17:33:23.237	2025-05-21 17:33:23.237
5	5g	3	2025-05-21 17:33:23.241	2025-05-21 17:33:23.241
6	10g	3	2025-05-21 17:33:23.241	2025-05-21 17:33:23.241
7	250g	4	2025-05-21 17:33:23.245	2025-05-21 17:33:23.245
8	500g	4	2025-05-21 17:33:23.245	2025-05-21 17:33:23.245
9	300g	5	2025-05-21 17:33:23.249	2025-05-21 17:33:23.249
10	600g	5	2025-05-21 17:33:23.249	2025-05-21 17:33:23.249
11	300g	6	2025-05-21 17:33:23.252	2025-05-21 17:33:23.252
12	500g	6	2025-05-21 17:33:23.252	2025-05-21 17:33:23.252
13	Chocolate	7	2025-05-21 17:33:23.255	2025-05-21 17:33:23.255
14	Vanilla	7	2025-05-21 17:33:23.256	2025-05-21 17:33:23.256
15	Standard	8	2025-05-21 17:33:23.259	2025-05-21 17:33:23.259
16	Extra	8	2025-05-21 17:33:23.259	2025-05-21 17:33:23.259
17	200g	9	2025-05-21 17:33:23.262	2025-05-21 17:33:23.262
18	400g	9	2025-05-21 17:33:23.262	2025-05-21 17:33:23.262
19	Orange	10	2025-05-21 17:33:23.265	2025-05-21 17:33:23.265
20	Cream	10	2025-05-21 17:33:23.265	2025-05-21 17:33:23.265
21	300g	11	2025-05-21 17:33:23.268	2025-05-21 17:33:23.268
22	600g	11	2025-05-21 17:33:23.268	2025-05-21 17:33:23.268
23	30 capsules	12	2025-05-21 17:33:23.271	2025-05-21 17:33:23.271
24	60 capsules	12	2025-05-21 17:33:23.271	2025-05-21 17:33:23.271
25	Regular	13	2025-05-21 17:33:23.274	2025-05-21 17:33:23.274
26	Extra	13	2025-05-21 17:33:23.274	2025-05-21 17:33:23.274
27	Fruit Punch	14	2025-05-21 17:33:23.277	2025-05-21 17:33:23.277
28	Blue Raspberry	14	2025-05-21 17:33:23.277	2025-05-21 17:33:23.277
29	Standard	15	2025-05-21 17:33:23.28	2025-05-21 17:33:23.28
30	Enhanced	15	2025-05-21 17:33:23.281	2025-05-21 17:33:23.281
31	Mild	16	2025-05-21 17:33:23.283	2025-05-21 17:33:23.283
32	Strong	16	2025-05-21 17:33:23.284	2025-05-21 17:33:23.284
33	Berry	17	2025-05-21 17:33:23.287	2025-05-21 17:33:23.287
34	Citrus	17	2025-05-21 17:33:23.287	2025-05-21 17:33:23.287
35	Regular	18	2025-05-21 17:33:23.29	2025-05-21 17:33:23.29
36	High	18	2025-05-21 17:33:23.29	2025-05-21 17:33:23.29
37	Chocolate	19	2025-05-21 17:33:23.292	2025-05-21 17:33:23.292
38	Vanilla	19	2025-05-21 17:33:23.293	2025-05-21 17:33:23.293
39	1kg	20	2025-05-21 17:33:23.295	2025-05-21 17:33:23.295
40	2kg	20	2025-05-21 17:33:23.295	2025-05-21 17:33:23.295
41	Chocolate	21	2025-05-21 17:33:23.298	2025-05-21 17:33:23.298
42	Strawberry	21	2025-05-21 17:33:23.298	2025-05-21 17:33:23.298
43	2lb	22	2025-05-21 17:33:23.301	2025-05-21 17:33:23.301
44	4lb	22	2025-05-21 17:33:23.301	2025-05-21 17:33:23.301
45	Chocolate	23	2025-05-21 17:33:23.304	2025-05-21 17:33:23.304
46	Vanilla	23	2025-05-21 17:33:23.304	2025-05-21 17:33:23.304
47	30 tablets	24	2025-05-21 17:33:23.308	2025-05-21 17:33:23.308
48	60 tablets	24	2025-05-21 17:33:23.308	2025-05-21 17:33:23.308
49	60 capsules	25	2025-05-21 17:33:23.311	2025-05-21 17:33:23.311
50	120 capsules	25	2025-05-21 17:33:23.311	2025-05-21 17:33:23.311
51	30 tablets	26	2025-05-21 17:33:23.314	2025-05-21 17:33:23.314
52	60 tablets	26	2025-05-21 17:33:23.315	2025-05-21 17:33:23.315
53	30 tablets	27	2025-05-21 17:33:23.317	2025-05-21 17:33:23.317
54	60 tablets	27	2025-05-21 17:33:23.317	2025-05-21 17:33:23.317
55	30 capsules	28	2025-05-21 17:33:23.32	2025-05-21 17:33:23.32
56	60 capsules	28	2025-05-21 17:33:23.32	2025-05-21 17:33:23.32
57	30 tablets	29	2025-05-21 17:33:23.323	2025-05-21 17:33:23.323
58	60 tablets	29	2025-05-21 17:33:23.323	2025-05-21 17:33:23.323
59	60 capsules	30	2025-05-21 17:33:23.326	2025-05-21 17:33:23.326
60	120 capsules	30	2025-05-21 17:33:23.326	2025-05-21 17:33:23.326
61	1 serving	31	2025-05-21 17:33:23.328	2025-05-21 17:33:23.328
62	2 servings	31	2025-05-21 17:33:23.329	2025-05-21 17:33:23.329
63	100ml	32	2025-05-21 17:33:23.332	2025-05-21 17:33:23.332
64	200ml	32	2025-05-21 17:33:23.333	2025-05-21 17:33:23.333
65	60 capsules	33	2025-05-21 17:33:23.335	2025-05-21 17:33:23.335
66	120 capsules	33	2025-05-21 17:33:23.335	2025-05-21 17:33:23.335
67	100 softgels	34	2025-05-21 17:33:23.338	2025-05-21 17:33:23.338
68	200 softgels	34	2025-05-21 17:33:23.338	2025-05-21 17:33:23.338
69	30 capsules	35	2025-05-21 17:33:23.341	2025-05-21 17:33:23.341
70	60 capsules	35	2025-05-21 17:33:23.341	2025-05-21 17:33:23.341
71	300g	36	2025-06-12 17:11:02.515	2025-06-12 17:11:02.515
72	400g	36	2025-06-12 17:11:02.518	2025-06-12 17:11:02.518
73	250g	37	2025-06-12 17:54:36.753	2025-06-12 17:54:36.753
74	500g	37	2025-06-12 17:54:36.755	2025-06-12 17:54:36.755
75	Vanilla	38	2025-06-12 17:56:04.63	2025-06-12 17:56:04.63
76	Chocolate	38	2025-06-12 17:56:04.631	2025-06-12 17:56:04.631
77	30 Servings	39	2025-06-12 17:57:31.894	2025-06-12 17:57:31.894
78	60 Servings	39	2025-06-12 17:57:31.898	2025-06-12 17:57:31.898
79	60 Tablets	40	2025-06-12 17:58:30.626	2025-06-12 17:58:30.626
80	120Tablets	40	2025-06-12 17:58:30.628	2025-06-12 17:58:30.628
\.


--
-- Data for Name: product_options; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.product_options (id, name, "productId", "createdAt", "updatedAt") FROM stdin;
1	Packaging	1	2025-05-21 17:33:23.227	2025-05-21 17:33:23.227
2	Packaging	2	2025-05-21 17:33:23.237	2025-05-21 17:33:23.237
3	Dosage	3	2025-05-21 17:33:23.241	2025-05-21 17:33:23.241
4	Packaging	4	2025-05-21 17:33:23.244	2025-05-21 17:33:23.244
5	Size	5	2025-05-21 17:33:23.249	2025-05-21 17:33:23.249
6	Packaging	6	2025-05-21 17:33:23.252	2025-05-21 17:33:23.252
7	Flavor	7	2025-05-21 17:33:23.255	2025-05-21 17:33:23.255
8	Packaging	8	2025-05-21 17:33:23.258	2025-05-21 17:33:23.258
9	Serving	9	2025-05-21 17:33:23.262	2025-05-21 17:33:23.262
10	Flavor	10	2025-05-21 17:33:23.265	2025-05-21 17:33:23.265
11	Size	11	2025-05-21 17:33:23.267	2025-05-21 17:33:23.267
12	Capsule Count	12	2025-05-21 17:33:23.271	2025-05-21 17:33:23.271
13	Intensity	13	2025-05-21 17:33:23.274	2025-05-21 17:33:23.274
14	Flavor	14	2025-05-21 17:33:23.276	2025-05-21 17:33:23.276
15	Dose	15	2025-05-21 17:33:23.28	2025-05-21 17:33:23.28
16	Intensity	16	2025-05-21 17:33:23.283	2025-05-21 17:33:23.283
17	Flavor	17	2025-05-21 17:33:23.286	2025-05-21 17:33:23.286
18	Intensity	18	2025-05-21 17:33:23.289	2025-05-21 17:33:23.289
19	Flavor	19	2025-05-21 17:33:23.292	2025-05-21 17:33:23.292
20	Size	20	2025-05-21 17:33:23.295	2025-05-21 17:33:23.295
21	Flavor	21	2025-05-21 17:33:23.298	2025-05-21 17:33:23.298
22	Size	22	2025-05-21 17:33:23.301	2025-05-21 17:33:23.301
23	Flavor	23	2025-05-21 17:33:23.304	2025-05-21 17:33:23.304
24	Bottle Size	24	2025-05-21 17:33:23.308	2025-05-21 17:33:23.308
25	Capsule Count	25	2025-05-21 17:33:23.311	2025-05-21 17:33:23.311
26	Bottle Size	26	2025-05-21 17:33:23.314	2025-05-21 17:33:23.314
27	Bottle Size	27	2025-05-21 17:33:23.317	2025-05-21 17:33:23.317
28	Capsule Count	28	2025-05-21 17:33:23.32	2025-05-21 17:33:23.32
29	Bottle Size	29	2025-05-21 17:33:23.323	2025-05-21 17:33:23.323
30	Package	30	2025-05-21 17:33:23.325	2025-05-21 17:33:23.325
31	Serving	31	2025-05-21 17:33:23.328	2025-05-21 17:33:23.328
32	Bottle Size	32	2025-05-21 17:33:23.332	2025-05-21 17:33:23.332
33	Capsule Count	33	2025-05-21 17:33:23.335	2025-05-21 17:33:23.335
34	Bottle Size	34	2025-05-21 17:33:23.338	2025-05-21 17:33:23.338
35	Package	35	2025-05-21 17:33:23.341	2025-05-21 17:33:23.341
36	Size	36	2025-06-12 17:11:02.511	2025-06-12 17:11:02.511
37	Size	46	2025-06-12 17:54:36.75	2025-06-12 17:54:36.75
38	Flavor	48	2025-06-12 17:56:04.626	2025-06-12 17:56:04.626
39	Size	47	2025-06-12 17:57:31.885	2025-06-12 17:57:31.885
40	Size	44	2025-06-12 17:58:30.624	2025-06-12 17:58:30.624
\.


--
-- Data for Name: product_variant_option_values; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.product_variant_option_values (id, "variantId", "optionValueId", "createdAt", "updatedAt") FROM stdin;
1	1	1	2025-05-21 17:33:23.232	2025-05-21 17:33:23.232
2	2	2	2025-05-21 17:33:23.235	2025-05-21 17:33:23.235
3	3	3	2025-05-21 17:33:23.238	2025-05-21 17:33:23.238
4	4	4	2025-05-21 17:33:23.239	2025-05-21 17:33:23.239
5	5	5	2025-05-21 17:33:23.242	2025-05-21 17:33:23.242
6	6	6	2025-05-21 17:33:23.243	2025-05-21 17:33:23.243
7	7	7	2025-05-21 17:33:23.246	2025-05-21 17:33:23.246
8	8	8	2025-05-21 17:33:23.247	2025-05-21 17:33:23.247
9	9	9	2025-05-21 17:33:23.25	2025-05-21 17:33:23.25
10	10	10	2025-05-21 17:33:23.25	2025-05-21 17:33:23.25
11	11	11	2025-05-21 17:33:23.253	2025-05-21 17:33:23.253
12	12	12	2025-05-21 17:33:23.254	2025-05-21 17:33:23.254
13	13	13	2025-05-21 17:33:23.256	2025-05-21 17:33:23.256
14	14	14	2025-05-21 17:33:23.257	2025-05-21 17:33:23.257
15	15	15	2025-05-21 17:33:23.26	2025-05-21 17:33:23.26
16	16	16	2025-05-21 17:33:23.26	2025-05-21 17:33:23.26
17	17	17	2025-05-21 17:33:23.263	2025-05-21 17:33:23.263
18	18	18	2025-05-21 17:33:23.263	2025-05-21 17:33:23.263
19	19	19	2025-05-21 17:33:23.266	2025-05-21 17:33:23.266
20	20	20	2025-05-21 17:33:23.266	2025-05-21 17:33:23.266
21	21	21	2025-05-21 17:33:23.269	2025-05-21 17:33:23.269
22	22	22	2025-05-21 17:33:23.27	2025-05-21 17:33:23.27
23	23	23	2025-05-21 17:33:23.272	2025-05-21 17:33:23.272
24	24	24	2025-05-21 17:33:23.273	2025-05-21 17:33:23.273
25	25	25	2025-05-21 17:33:23.275	2025-05-21 17:33:23.275
26	26	26	2025-05-21 17:33:23.276	2025-05-21 17:33:23.276
27	27	27	2025-05-21 17:33:23.278	2025-05-21 17:33:23.278
28	28	28	2025-05-21 17:33:23.278	2025-05-21 17:33:23.278
29	29	29	2025-05-21 17:33:23.281	2025-05-21 17:33:23.281
30	30	30	2025-05-21 17:33:23.282	2025-05-21 17:33:23.282
31	31	31	2025-05-21 17:33:23.284	2025-05-21 17:33:23.284
32	32	32	2025-05-21 17:33:23.285	2025-05-21 17:33:23.285
33	33	33	2025-05-21 17:33:23.287	2025-05-21 17:33:23.287
34	34	34	2025-05-21 17:33:23.288	2025-05-21 17:33:23.288
35	35	35	2025-05-21 17:33:23.29	2025-05-21 17:33:23.29
36	36	36	2025-05-21 17:33:23.291	2025-05-21 17:33:23.291
37	37	37	2025-05-21 17:33:23.293	2025-05-21 17:33:23.293
38	38	38	2025-05-21 17:33:23.294	2025-05-21 17:33:23.294
39	39	39	2025-05-21 17:33:23.296	2025-05-21 17:33:23.296
40	40	40	2025-05-21 17:33:23.297	2025-05-21 17:33:23.297
41	41	41	2025-05-21 17:33:23.299	2025-05-21 17:33:23.299
42	42	42	2025-05-21 17:33:23.299	2025-05-21 17:33:23.299
43	43	43	2025-05-21 17:33:23.302	2025-05-21 17:33:23.302
44	44	44	2025-05-21 17:33:23.303	2025-05-21 17:33:23.303
45	45	45	2025-05-21 17:33:23.305	2025-05-21 17:33:23.305
46	46	46	2025-05-21 17:33:23.306	2025-05-21 17:33:23.306
47	47	47	2025-05-21 17:33:23.309	2025-05-21 17:33:23.309
48	48	48	2025-05-21 17:33:23.31	2025-05-21 17:33:23.31
49	49	49	2025-05-21 17:33:23.312	2025-05-21 17:33:23.312
50	50	50	2025-05-21 17:33:23.313	2025-05-21 17:33:23.313
51	51	51	2025-05-21 17:33:23.315	2025-05-21 17:33:23.315
52	52	52	2025-05-21 17:33:23.316	2025-05-21 17:33:23.316
53	53	53	2025-05-21 17:33:23.318	2025-05-21 17:33:23.318
54	54	54	2025-05-21 17:33:23.319	2025-05-21 17:33:23.319
55	55	55	2025-05-21 17:33:23.321	2025-05-21 17:33:23.321
56	56	56	2025-05-21 17:33:23.322	2025-05-21 17:33:23.322
57	57	57	2025-05-21 17:33:23.324	2025-05-21 17:33:23.324
58	58	58	2025-05-21 17:33:23.325	2025-05-21 17:33:23.325
59	59	59	2025-05-21 17:33:23.326	2025-05-21 17:33:23.326
60	60	60	2025-05-21 17:33:23.327	2025-05-21 17:33:23.327
61	61	61	2025-05-21 17:33:23.329	2025-05-21 17:33:23.329
62	62	62	2025-05-21 17:33:23.33	2025-05-21 17:33:23.33
63	63	63	2025-05-21 17:33:23.333	2025-05-21 17:33:23.333
64	64	64	2025-05-21 17:33:23.334	2025-05-21 17:33:23.334
65	65	65	2025-05-21 17:33:23.336	2025-05-21 17:33:23.336
66	66	66	2025-05-21 17:33:23.336	2025-05-21 17:33:23.336
67	67	67	2025-05-21 17:33:23.339	2025-05-21 17:33:23.339
68	68	68	2025-05-21 17:33:23.34	2025-05-21 17:33:23.34
69	69	69	2025-05-21 17:33:23.342	2025-05-21 17:33:23.342
70	70	70	2025-05-21 17:33:23.343	2025-05-21 17:33:23.343
71	71	71	2025-06-12 17:11:02.523	2025-06-12 17:11:02.523
72	72	72	2025-06-12 17:11:02.527	2025-06-12 17:11:02.527
73	73	73	2025-06-12 17:54:36.759	2025-06-12 17:54:36.759
74	74	74	2025-06-12 17:54:36.761	2025-06-12 17:54:36.761
75	75	75	2025-06-12 17:56:04.635	2025-06-12 17:56:04.635
76	76	76	2025-06-12 17:56:04.637	2025-06-12 17:56:04.637
77	77	77	2025-06-12 17:57:31.909	2025-06-12 17:57:31.909
78	78	78	2025-06-12 17:57:31.914	2025-06-12 17:57:31.914
79	79	79	2025-06-12 17:58:30.631	2025-06-12 17:58:30.631
80	80	80	2025-06-12 17:58:30.632	2025-06-12 17:58:30.632
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.product_variants (id, "productId", price, stock, "createdAt", "updatedAt") FROM stdin;
2	1	39.99	20	2025-05-21 17:33:23.234	2025-05-21 17:33:23.234
3	2	34.99	25	2025-05-21 17:33:23.238	2025-05-21 17:33:23.238
4	2	49.99	15	2025-05-21 17:33:23.239	2025-05-21 17:33:23.239
5	3	27.99	35	2025-05-21 17:33:23.242	2025-05-21 17:33:23.242
6	3	39.99	25	2025-05-21 17:33:23.242	2025-05-21 17:33:23.242
7	4	32.99	25	2025-05-21 17:33:23.246	2025-05-21 17:33:23.246
8	4	49.99	20	2025-05-21 17:33:23.247	2025-05-21 17:33:23.247
9	5	24.99	40	2025-05-21 17:33:23.25	2025-05-21 17:33:23.25
10	5	39.99	30	2025-05-21 17:33:23.25	2025-05-21 17:33:23.25
11	6	26.99	45	2025-05-21 17:33:23.253	2025-05-21 17:33:23.253
12	6	39.99	35	2025-05-21 17:33:23.253	2025-05-21 17:33:23.253
13	7	39.99	30	2025-05-21 17:33:23.256	2025-05-21 17:33:23.256
14	7	39.99	20	2025-05-21 17:33:23.257	2025-05-21 17:33:23.257
16	8	39.99	20	2025-05-21 17:33:23.26	2025-05-21 17:33:23.26
17	9	19.99	60	2025-05-21 17:33:23.262	2025-05-21 17:33:23.262
18	9	34.99	40	2025-05-21 17:33:23.263	2025-05-21 17:33:23.263
19	10	44.99	20	2025-05-21 17:33:23.266	2025-05-21 17:33:23.266
20	10	44.99	20	2025-05-21 17:33:23.266	2025-05-21 17:33:23.266
21	11	39.99	30	2025-05-21 17:33:23.268	2025-05-21 17:33:23.268
22	11	64.99	25	2025-05-21 17:33:23.269	2025-05-21 17:33:23.269
23	12	24.99	25	2025-05-21 17:33:23.272	2025-05-21 17:33:23.272
24	12	39.99	20	2025-05-21 17:33:23.272	2025-05-21 17:33:23.272
25	13	34.99	30	2025-05-21 17:33:23.275	2025-05-21 17:33:23.275
26	13	39.99	20	2025-05-21 17:33:23.275	2025-05-21 17:33:23.275
28	14	39.99	25	2025-05-21 17:33:23.278	2025-05-21 17:33:23.278
29	15	36.99	25	2025-05-21 17:33:23.281	2025-05-21 17:33:23.281
30	15	44.99	20	2025-05-21 17:33:23.282	2025-05-21 17:33:23.282
31	16	34.99	35	2025-05-21 17:33:23.284	2025-05-21 17:33:23.284
32	16	42.99	25	2025-05-21 17:33:23.284	2025-05-21 17:33:23.284
33	17	36.99	25	2025-05-21 17:33:23.287	2025-05-21 17:33:23.287
34	17	36.99	20	2025-05-21 17:33:23.288	2025-05-21 17:33:23.288
35	18	29.99	35	2025-05-21 17:33:23.29	2025-05-21 17:33:23.29
36	18	36.99	30	2025-05-21 17:33:23.291	2025-05-21 17:33:23.291
37	19	49.99	20	2025-05-21 17:33:23.293	2025-05-21 17:33:23.293
38	19	49.99	20	2025-05-21 17:33:23.294	2025-05-21 17:33:23.294
39	20	54.99	15	2025-05-21 17:33:23.296	2025-05-21 17:33:23.296
40	20	89.99	15	2025-05-21 17:33:23.296	2025-05-21 17:33:23.296
41	21	44.99	25	2025-05-21 17:33:23.299	2025-05-21 17:33:23.299
42	21	44.99	20	2025-05-21 17:33:23.299	2025-05-21 17:33:23.299
43	22	59.99	20	2025-05-21 17:33:23.302	2025-05-21 17:33:23.302
44	22	99.99	15	2025-05-21 17:33:23.302	2025-05-21 17:33:23.302
45	23	49.99	25	2025-05-21 17:33:23.305	2025-05-21 17:33:23.305
46	23	49.99	25	2025-05-21 17:33:23.305	2025-05-21 17:33:23.305
47	24	24.99	50	2025-05-21 17:33:23.309	2025-05-21 17:33:23.309
48	24	44.99	50	2025-05-21 17:33:23.309	2025-05-21 17:33:23.309
49	25	19.99	35	2025-05-21 17:33:23.312	2025-05-21 17:33:23.312
50	25	34.99	35	2025-05-21 17:33:23.312	2025-05-21 17:33:23.312
51	26	26.99	30	2025-05-21 17:33:23.315	2025-05-21 17:33:23.315
52	26	49.99	30	2025-05-21 17:33:23.316	2025-05-21 17:33:23.316
53	27	29.99	25	2025-05-21 17:33:23.318	2025-05-21 17:33:23.318
54	27	54.99	25	2025-05-21 17:33:23.318	2025-05-21 17:33:23.318
55	28	14.99	40	2025-05-21 17:33:23.321	2025-05-21 17:33:23.321
56	28	27.99	40	2025-05-21 17:33:23.321	2025-05-21 17:33:23.321
57	29	12.99	45	2025-05-21 17:33:23.324	2025-05-21 17:33:23.324
58	29	23.99	45	2025-05-21 17:33:23.324	2025-05-21 17:33:23.324
59	30	39.99	25	2025-05-21 17:33:23.326	2025-05-21 17:33:23.326
61	31	14.99	40	2025-05-21 17:33:23.329	2025-05-21 17:33:23.329
62	31	27.99	35	2025-05-21 17:33:23.329	2025-05-21 17:33:23.329
63	32	22.99	30	2025-05-21 17:33:23.333	2025-05-21 17:33:23.333
64	32	39.99	30	2025-05-21 17:33:23.334	2025-05-21 17:33:23.334
65	33	29.99	20	2025-05-21 17:33:23.336	2025-05-21 17:33:23.336
66	33	54.99	20	2025-05-21 17:33:23.336	2025-05-21 17:33:23.336
67	34	17.99	35	2025-05-21 17:33:23.339	2025-05-21 17:33:23.339
68	34	32.99	35	2025-05-21 17:33:23.34	2025-05-21 17:33:23.34
69	35	34.99	18	2025-05-21 17:33:23.342	2025-05-21 17:33:23.342
70	35	64.99	17	2025-05-21 17:33:23.342	2025-05-21 17:33:23.342
60	30	74.99	23	2025-05-21 17:33:23.327	2025-06-07 17:55:43.159
27	14	39.99	24	2025-05-21 17:33:23.277	2025-06-07 17:55:43.16
15	8	29.99	23	2025-05-21 17:33:23.259	2025-06-07 17:55:43.162
1	1	29.99	26	2025-05-21 17:33:23.231	2025-06-07 17:55:43.163
71	36	49	15	2025-06-12 17:11:02.52	2025-06-12 17:11:02.52
72	36	55	10	2025-06-12 17:11:02.526	2025-06-12 17:11:02.526
73	46	35	20	2025-06-12 17:54:36.758	2025-06-12 17:54:36.758
74	46	42	12	2025-06-12 17:54:36.76	2025-06-12 17:54:36.76
75	48	46	20	2025-06-12 17:56:04.634	2025-06-12 17:56:04.634
76	48	46	15	2025-06-12 17:56:04.636	2025-06-12 17:56:04.636
77	47	48	10	2025-06-12 17:57:31.906	2025-06-12 17:57:31.906
78	47	60	14	2025-06-12 17:57:31.912	2025-06-12 17:57:31.912
79	44	28	20	2025-06-12 17:58:30.63	2025-06-12 17:58:30.63
80	44	40	25	2025-06-12 17:58:30.632	2025-06-12 17:58:30.632
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.products (id, name, slug, sku, description, brand, "categoryId", price, quantity, is_demo, "createdAt", "updatedAt") FROM stdin;
1	Blackstone Creatine	blackstone-creatine	BSL-CRE-300	Premium creatine monohydrate for strength.	Blackstone	6	29.99	50	t	2025-05-21 17:33:23.223	2025-05-21 17:33:23.223
2	Con-Cret Creatine HCL	con-cret-creatine-hcl	CON-CRE-HCL	Highly soluble creatine HCL for absorption.	Con-Cret	6	34.99	40	t	2025-05-21 17:33:23.235	2025-05-21 17:33:23.235
3	EFX Creatine Capsules	efx-creatine-capsules	EFX-CAP-5	Capsule form creatine with enhanced stability.	EFX Sports	6	27.99	60	t	2025-05-21 17:33:23.24	2025-05-21 17:33:23.24
4	HPN Creapure Creatine	hpn-creapure-creatine	HPN-CRE-250	Ultra-pure Creapure creatine for peak performance.	Hi-Tech	6	32.99	45	t	2025-05-21 17:33:23.243	2025-05-21 17:33:23.243
5	Kodagenix Creatine	kodagenix-creatine	KOD-CRE-300	Micronized creatine for fast absorption.	Kodagenix	6	24.99	70	t	2025-05-21 17:33:23.247	2025-05-21 17:33:23.247
6	Pro Supps Creatine	pro-supps-creatine	PS-CRE-300	High-quality creatine for performance.	Pro Supps	6	26.99	80	t	2025-05-21 17:33:23.251	2025-05-21 17:33:23.251
7	Choc Whey Protein	choc-whey-protein	CWP-1000	Delicious chocolate whey protein for recovery.	Optimum Nutrition	2	39.99	50	t	2025-05-21 17:33:23.254	2025-05-21 17:33:23.254
8	Post-Workout Creatine Blend	post-workout-creatine-blend	PWCB-500	Optimized creatine blend for recovery.	BSN	2	29.99	45	t	2025-05-21 17:33:23.258	2025-05-21 17:33:23.258
9	Glutamine Powder	glutamine-powder	GP-200	Pure glutamine powder for muscle recovery.	Dymatize	2	19.99	100	t	2025-05-21 17:33:23.261	2025-05-21 17:33:23.261
10	Core ISO Clear	core-iso-clear	CIC-1000	Refreshing orange cream protein isolate.	Core Nutritionals	2	44.99	30	t	2025-05-21 17:33:23.264	2025-05-21 17:33:23.264
11	Karbolyn Fuel	karbolyn-fuel	KF-300	Carb formula to replenish muscle glycogen.	EFX Sports	2	39.99	25	t	2025-05-21 17:33:23.267	2025-05-21 17:33:23.267
12	ZMA Recovery	zma-recovery	ZMA-30	Zinc & magnesium supplement for recovery.	NOW Foods	2	24.99	40	t	2025-05-21 17:33:23.27	2025-05-21 17:33:23.27
13	Outrage Pre-Workout	outrage-pre-workout	OUT-250	High-energy pre-workout for explosive sessions.	Nutrex Research	1	34.99	50	t	2025-05-21 17:33:23.273	2025-05-21 17:33:23.273
14	Alpha Lion Pump	alpha-lion-pump	ALP-300	Pump booster for intense training.	Alpha Lion	1	39.99	40	t	2025-05-21 17:33:23.276	2025-05-21 17:33:23.276
15	Blackstone Hype	blackstone-hype	BSH-250	Non-stimulant pre-workout for sustained energy.	Blackstone	1	36.99	25	t	2025-05-21 17:33:23.279	2025-05-21 17:33:23.279
16	Bucked Up Pre-Workout	bucked-up-pre-workout	BU-300	High-energy formula for peak performance.	Bucked Up	1	34.99	35	t	2025-05-21 17:33:23.282	2025-05-21 17:33:23.282
17	Pump-N-Grind	pump-n-grind	PNG-300	Explosive pre-workout to maximize endurance.	Rich Piana 5%	1	36.99	25	t	2025-05-21 17:33:23.285	2025-05-21 17:33:23.285
18	Purus Labs Pre-Workout	purus-labs-pre-workout	PL-250	Lemonade-flavored pre-workout for optimal energy.	Purus Labs	1	29.99	35	t	2025-05-21 17:33:23.288	2025-05-21 17:33:23.288
19	BCAA Xplode Protein	bcaa-xplode-protein	BX-1000	Protein formula enriched with BCAAs for recovery.	Olimp	5	49.99	20	t	2025-05-21 17:33:23.291	2025-05-21 17:33:23.291
20	Gold Standard Casein	gold-standard-casein	GSC-1000	High-quality casein protein for sustained recovery.	Optimum Nutrition	5	54.99	15	t	2025-05-21 17:33:23.294	2025-05-21 17:33:23.294
21	MB Proteins	mb-proteins	MBP-1000	Blended protein for optimal muscle growth.	Muscle Beach	5	44.99	25	t	2025-05-21 17:33:23.297	2025-05-21 17:33:23.297
22	Olimp Gold Gainer	olimp-gold-gainer	OGG-2LB	Calorie-rich gainer to support muscle mass.	Olimp	5	59.99	20	t	2025-05-21 17:33:23.3	2025-05-21 17:33:23.3
23	Olimp Gold Protein	olimp-gold-protein	OGP-1000	Premium whey protein for lean muscle building.	Olimp	5	49.99	25	t	2025-05-21 17:33:23.303	2025-05-21 17:33:23.303
24	Ancient Men's Multi	ancient-mens-multi	AMM-30	Daily multivitamin for men's health.	Ancient Nutrition	3	24.99	50	t	2025-05-21 17:33:23.307	2025-05-21 17:33:23.307
25	Liposomal Vitamin D3	liposomal-vitamin-d3	LVD-60	High-absorption vitamin D3 in liposomal form.	LivOn Labs	3	19.99	35	t	2025-05-21 17:33:23.31	2025-05-21 17:33:23.31
26	Core Multi	core-multi	CM-30	Daily multivitamin with essential nutrients.	Core Nutritionals	3	26.99	30	t	2025-05-21 17:33:23.313	2025-05-21 17:33:23.313
27	Vegan Multivitamin	vegan-multivitamin	VM-30	Plant-based multivitamin for optimal health.	Garden of Life	3	29.99	25	t	2025-05-21 17:33:23.316	2025-05-21 17:33:23.316
28	Legion Vit D & K	legion-vit-d-k	LDK-30	Supports bone health with vitamins D & K.	Legion	3	14.99	40	t	2025-05-21 17:33:23.319	2025-05-21 17:33:23.319
29	Now Foods Vitamin B12	now-foods-vitamin-b12	NFB-30	High-potency vitamin B12 for an energy boost.	NOW Foods	3	12.99	45	t	2025-05-21 17:33:23.322	2025-05-21 17:33:23.322
30	Cognisport	cognisport	CSP-60	Advanced weight management supplement.	Cognitive Nutrition	4	39.99	25	t	2025-05-21 17:33:23.325	2025-05-21 17:33:23.325
31	Tribulus Extract	tribulus-extract	TRE-1	Herbal extract to support hormone balance.	NOW Foods	4	14.99	40	t	2025-05-21 17:33:23.327	2025-05-21 17:33:23.327
32	Liposomal Vitamin C	liposomal-vitamin-c	LVC-100	Enhanced vitamin C for immune support.	LivOn Labs	4	22.99	30	t	2025-05-21 17:33:23.33	2025-05-21 17:33:23.33
33	Calcium Magnesium Combo	calcium-magnesium-combo	CMC-60	Essential minerals for bone & muscle health.	Nature Made	4	29.99	20	t	2025-05-21 17:33:23.334	2025-05-21 17:33:23.334
34	Fish Oil Omega-3	fish-oil-omega-3	FIO-100	Omega-3 fatty acids to support heart health.	Nordic Naturals	4	17.99	35	t	2025-05-21 17:33:23.337	2025-05-21 17:33:23.337
35	Bloat Eaze Pro	bloat-eaze-pro	BEP-30	Advanced formula to reduce bloating.	BioTrust	4	34.99	18	t	2025-05-21 17:33:23.34	2025-05-21 17:33:23.34
36	Mutant CreakOng 	mutant-creakong	\N	Premium creatine formula designed for serious athletes seeking maximum muscle power and strength gains. Features a proprietary blend of creatine monohydrate, creatine HCl, and absorption enhancers for superior bioavailability and faster results.	Mutant	6	49	25	t	2025-06-12 17:11:02.498	2025-06-12 17:11:02.498
37	ABE Creatine	abe-creatine	\N	Pure creatine monohydrate supplement designed to enhance athletic performance, increase muscle strength, and support explosive power output. Scientifically proven formula helps maximize training intensity and promotes faster muscle recovery between sets.	ABE	6	24	40	t	2025-06-12 17:32:56.654	2025-06-12 17:32:56.654
38	5 Nutrition L-Glutamine	5-nutrition-l-glutamine	\N	Pure L-Glutamine amino acid supplement designed to support muscle recovery, reduce muscle breakdown, and enhance immune system function. Essential for post-workout recovery and maintaining lean muscle mass during intense training periods.	5 Nutrition	2	32	35	t	2025-06-12 17:34:15.837	2025-06-12 17:34:15.837
39	ALRI HumaPro	alri-humapro	\N	Revolutionary amino acid protein synthesis activator featuring a proprietary blend of essential amino acids in precise ratios. Designed to maximize protein synthesis, enhance muscle recovery, and provide superior nitrogen retention for lean muscle growth and athletic performance.	ALRI	2	58	18	t	2025-06-12 17:34:55.262	2025-06-12 17:34:55.262
40	 Bucked Up Woke AF High Stimulant 	bucked-up-woke-af-high-stimulant	\N	Extreme high-stimulant pre-workout formula for advanced users seeking maximum energy, focus, and performance. Features a potent blend of caffeine, nootropics, and performance enhancers designed to deliver intense workouts and razor-sharp mental clarity. Not for beginners - this is for those who demand the ultimate pre-workout experience.	Bucked Up	1	45	22	t	2025-06-12 17:37:21.512	2025-06-12 17:37:21.512
41	RipTX	riptx	\N	High-performance pre-workout formula engineered for explosive energy, enhanced focus, and maximum pump. Contains a synergistic blend of caffeine, beta-alanine, citrulline, and nootropics to fuel intense training sessions and deliver sustained energy without the crash.	RipTX	1	38	28	t	2025-06-12 17:38:04.749	2025-06-12 17:38:04.749
42	 Panda Fuel Premium	panda-fuel-premium	\N	High-quality whey protein blend designed to fuel muscle growth, recovery, and strength gains. Features a smooth-mixing formula with superior taste and digestibility. Perfect for post-workout recovery or anytime protein supplementation to support lean muscle development and fitness goals.\r\n	Panda Supplements	5	52	30	t	2025-06-12 17:39:03.422	2025-06-12 17:39:03.422
43	Redcon1 MRE	redcon1-mre	\N	Military-grade meal replacement protein made from whole food sources including beef, salmon, chicken, eggs, and brown rice. Provides complete nutrition with natural ingredients - no whey, no concentrate, just real food protein sources for serious athletes and active individuals seeking genuine nutrition.	Redcon1	5	65	20	t	2025-06-12 17:41:03.748	2025-06-12 17:41:03.748
44	Mutant Multi High Potency	mutant-multi-high-potency	\N	Comprehensive high-potency multivitamin and mineral complex designed for serious athletes and active individuals. Packed with essential vitamins, minerals, antioxidants, and performance-supporting nutrients to fill nutritional gaps and optimize overall health and training performance.	Mutant	3	28	45	t	2025-06-12 17:41:51.227	2025-06-12 17:41:51.227
45	Panda Panda Greens Natural	panda-panda-greens-natural	\N	Nutrient-dense superfood blend featuring organic greens, fruits, vegetables, and adaptogens. Supports daily nutrition, immune function, and energy levels with a comprehensive mix of vitamins, minerals, antioxidants, and phytonutrients from whole food sources.	Panda Supplements	3	42	25	t	2025-06-12 17:42:31.165	2025-06-12 17:42:31.165
46	 Applied Nutrition Shred X	applied-nutrition-shred-x	\N	 Advanced thermogenic fat burner designed to boost metabolism, increase energy, and support weight management goals. Features a powerful blend of natural thermogenic ingredients, caffeine, and fat-burning compounds to enhance calorie burn and promote lean physique development.	Applied Nutrition	4	35	32	t	2025-06-12 17:43:21.274	2025-06-12 17:43:21.274
47	 Bucked Up LFG Burn Thermogenic 	bucked-up-lfg-burn-thermogenic	\N	Dual-action thermogenic pre-workout that combines intense energy and focus with powerful fat-burning ingredients. Features premium stimulants, metabolism boosters, and performance enhancers to maximize workouts while supporting body composition goals. Perfect for cutting phases and lean muscle development.	Bucked Up	4	48	24	t	2025-06-12 17:43:52.259	2025-06-12 17:43:52.259
48	SSA Protein	ssa-protein	\N	High-quality whey protein concentrate designed to support muscle growth, recovery, and strength development. Features excellent mixability, great taste, and optimal amino acid profile for post-workout nutrition and daily protein supplementation to meet fitness and bodybuilding goals.	SSA	5	46	35	t	2025-06-12 17:46:59.022	2025-06-12 17:46:59.022
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.users (id, name, email, email_verified, image, role, password) FROM stdin;
cmbm3o61e0000zgb2mxbg7sey	Admin	admin@example.com	\N	\N	ADMIN	$2b$10$wXA4R55cgbZLZjv.b7vL4ONqkyP/JeZlX5jheaLDV2TWJ.ZtgjBDu
cmbmgwerj0000zgq79u4skmms	Michael Johnson	demo.customer@gmail.com	\N	\N	USER	$2b$10$1Kg0dgnzMwogDkvlYHFeiuLxIzNLfudpm3jeUFgfZq2vh7MuBMziG
cmbmir3k10000zg4t3tf47e4d	Dennis Vaga	contact@dennisvaga.com	\N	https://lh3.googleusercontent.com/a/ACg8ocIWHeZG9oWAEfhUtIH5kRD48hzte_32bnbYKHCpYotv22aG9h0=s96-c	USER	\N
\.


--
-- Data for Name: verificationtokens; Type: TABLE DATA; Schema: public; Owner: dennis
--

COPY public.verificationtokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 58, true);


--
-- Name: Cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public."Cart_id_seq"', 8, true);


--
-- Name: Collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public."Collection_id_seq"', 3, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 14, true);


--
-- Name: Order_orderNumber_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public."Order_orderNumber_seq"', 3, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.countries_id_seq', 250, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.product_images_id_seq', 48, true);


--
-- Name: product_option_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.product_option_values_id_seq', 80, true);


--
-- Name: product_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.product_options_id_seq', 40, true);


--
-- Name: product_variant_option_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.product_variant_option_values_id_seq', 80, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 80, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dennis
--

SELECT pg_catalog.setval('public.products_id_seq', 48, true);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Collection Collection_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ShippingInfo ShippingInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."ShippingInfo"
    ADD CONSTRAINT "ShippingInfo_pkey" PRIMARY KEY (id);


--
-- Name: _CollectionToProduct _CollectionToProduct_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."_CollectionToProduct"
    ADD CONSTRAINT "_CollectionToProduct_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_option_values product_option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT product_option_values_pkey PRIMARY KEY (id);


--
-- Name: product_options product_options_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT product_options_pkey PRIMARY KEY (id);


--
-- Name: product_variant_option_values product_variant_option_values_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variant_option_values
    ADD CONSTRAINT product_variant_option_values_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: CartItem_cartId_productId_variantId_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_variantId_key" ON public."CartItem" USING btree ("cartId", "productId", "variantId");


--
-- Name: Cart_sessionId_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "Cart_sessionId_key" ON public."Cart" USING btree ("sessionId");


--
-- Name: Cart_userId_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "Cart_userId_key" ON public."Cart" USING btree ("userId");


--
-- Name: Collection_slug_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "Collection_slug_key" ON public."Collection" USING btree (slug);


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: _CollectionToProduct_B_index; Type: INDEX; Schema: public; Owner: dennis
--

CREATE INDEX "_CollectionToProduct_B_index" ON public."_CollectionToProduct" USING btree ("B");


--
-- Name: accounts_provider_provider_account_id_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX accounts_provider_provider_account_id_key ON public.accounts USING btree (provider, provider_account_id);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: countries_code_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX countries_code_key ON public.countries USING btree (code);


--
-- Name: product_option_values_optionId_value_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "product_option_values_optionId_value_key" ON public.product_option_values USING btree ("optionId", value);


--
-- Name: product_options_productId_name_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX "product_options_productId_name_key" ON public.product_options USING btree ("productId", name);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: verificationtokens_identifier_token_key; Type: INDEX; Schema: public; Owner: dennis
--

CREATE UNIQUE INDEX verificationtokens_identifier_token_key ON public.verificationtokens USING btree (identifier, token);


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Collection Collection_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Collection"
    ADD CONSTRAINT "Collection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_shippingInfoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_shippingInfoId_fkey" FOREIGN KEY ("shippingInfoId") REFERENCES public."ShippingInfo"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ShippingInfo ShippingInfo_countryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."ShippingInfo"
    ADD CONSTRAINT "ShippingInfo_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _CollectionToProduct _CollectionToProduct_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."_CollectionToProduct"
    ADD CONSTRAINT "_CollectionToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES public."Collection"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CollectionToProduct _CollectionToProduct_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public."_CollectionToProduct"
    ADD CONSTRAINT "_CollectionToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_option_values product_option_values_optionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_option_values
    ADD CONSTRAINT "product_option_values_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES public.product_options(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_options product_options_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_options
    ADD CONSTRAINT "product_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option_values product_variant_option_values_optionValueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variant_option_values
    ADD CONSTRAINT "product_variant_option_values_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES public.product_option_values(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option_values product_variant_option_values_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variant_option_values
    ADD CONSTRAINT "product_variant_option_values_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public.product_variants(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variants product_variants_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dennis
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO dennis;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO dennis;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO dennis;


--
-- PostgreSQL database dump complete
--

