CREATE TABLE page_relations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_page_id BIGINT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    child_page_id BIGINT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    position INT NOT NULL,
    CONSTRAINT unique_parent_child UNIQUE (parent_page_id, child_page_id),
    CHECK (parent_page_id <> child_page_id)
);
