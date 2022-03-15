DROP TABLE public.stock IF EXISTS;
DROP TABLE public.products IF EXISTS;


CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title text,
    description text,
    price integer,
    logo text,
    count integer
);

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pk PRIMARY KEY (id);



CREATE TABLE public.stock (
    product_id uuid,
    count integer
);

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_un UNIQUE (product_id);

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_fk FOREIGN KEY (product_id) REFERENCES public.products(id);



