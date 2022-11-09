package com.agh.shoppingListBackend.app.payload.request;

import com.agh.shoppingListBackend.app.enums.Units;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class ItemDTO {
    @NotBlank
    private String text;

    @NotNull
    private Float quantity;

    @NotNull
    private Units unit;

    @NotNull
    private Long listId;
}
