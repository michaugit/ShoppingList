package com.agh.shoppingListBackend.app.payload.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class ListDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String date;
}
