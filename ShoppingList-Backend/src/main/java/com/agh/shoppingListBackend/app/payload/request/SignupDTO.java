package com.agh.shoppingListBackend.app.payload.request;

import java.util.Set;

import javax.validation.constraints.*;
 
public class SignupDTO {
    @NotBlank
    @Size(min = 4, max = 25)
    private String username;
    
    private Set<String> role;
    
    @NotBlank
    @Size(min = 4, max = 25)
    private String password;
  
    public String getUsername() {
        return username;
    }
 
    public void setUsername(String username) {
        this.username = username;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Set<String> getRole() {
      return this.role;
    }
    
    public void setRole(Set<String> role) {
      this.role = role;
    }
}
