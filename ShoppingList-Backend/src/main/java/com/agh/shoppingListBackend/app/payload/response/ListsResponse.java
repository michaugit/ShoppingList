package com.agh.shoppingListBackend.app.payload.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
public class ListsResponse implements Serializable {
    private List<SimpleListResponse> shoppingLists = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListsResponse that = (ListsResponse) o;
        return Objects.equals(shoppingLists, that.shoppingLists);
    }

    @Override
    public int hashCode() {
        return Objects.hash(shoppingLists);
    }
}
