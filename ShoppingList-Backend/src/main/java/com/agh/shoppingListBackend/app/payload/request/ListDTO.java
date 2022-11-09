package com.agh.shoppingListBackend.app.payload.request;

import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Date;
import java.util.Set;

@Getter
@Setter
public class ListDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String date;

}
