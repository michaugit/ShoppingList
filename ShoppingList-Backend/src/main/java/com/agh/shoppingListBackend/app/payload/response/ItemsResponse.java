package com.agh.shoppingListBackend.app.payload.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ItemsResponse {
    private Long listId;
    private String listName;
    private String date;
    private List<SingleItemResponse> items = new ArrayList<>();
}
