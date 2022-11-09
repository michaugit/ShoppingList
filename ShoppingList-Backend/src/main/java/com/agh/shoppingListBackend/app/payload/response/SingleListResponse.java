package com.agh.shoppingListBackend.app.payload.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Objects;

@Setter
@Getter
@NoArgsConstructor
public class SingleListResponse {
    private Long id;
    private String name;
    private String date;


    public SingleListResponse(Long id, String name, String date){
        this.id = id;
        this.name = name;
        this.date = date;
    }
}
