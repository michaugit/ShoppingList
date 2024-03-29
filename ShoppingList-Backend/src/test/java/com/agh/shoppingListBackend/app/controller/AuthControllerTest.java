package com.agh.shoppingListBackend.app.controller;

import com.agh.shoppingListBackend.app.controllers.AuthController;
import com.agh.shoppingListBackend.app.enums.RoleEnum;
import com.agh.shoppingListBackend.app.models.Role;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.LoginDTO;
import com.agh.shoppingListBackend.app.payload.request.SignupDTO;
import com.agh.shoppingListBackend.app.repository.RoleRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.agh.shoppingListBackend.app.security.jwt.JwtUtils;
import com.agh.shoppingListBackend.app.security.services.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Set;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    private ObjectMapper objectMapper;

    @MockBean
    AuthenticationManager authenticationManager;

    @MockBean
    UserRepository testUserRepository;

    @MockBean
    RoleRepository testRoleRepository;

    @MockBean
    PasswordEncoder encoder;

    @MockBean
    JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(this.context)
                .apply(springSecurity())
                .build();
        objectMapper = new ObjectMapper();
    }


    @Test
    @WithMockUser
    void testAuthenticateUser() throws Exception {
        Authentication authentication = Mockito.mock(Authentication.class);

        String username = "user";
        String password = "pass";

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername(username);
        loginDTO.setPassword(password);

        User user = new User();
        user.setId(1L);
        user.setUsername(username);
        user.setPassword(password);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        ResponseCookie responseCookie = ResponseCookie.from("test", "test").build();

        when(authenticationManager.authenticate(authenticationToken)).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtCookie(userDetails)).thenReturn(responseCookie);
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO))
                .with(csrf()))
                .andExpect(status().isOk());

        verify(authenticationManager).authenticate(authenticationToken);
        verify(jwtUtils).generateJwtCookie(userDetails);
    }


    @Test
    @WithMockUser
    void testRegisterUser() throws Exception {
        SignupDTO signupDTO = new SignupDTO();

        signupDTO.setUsername("user");
        signupDTO.setPassword("pass");

        when(testUserRepository.existsByUsername(signupDTO.getUsername())).thenReturn(false);
        when(testRoleRepository.findByName(RoleEnum.ROLE_USER)).thenReturn(java.util.Optional.of(new Role()));

        mockMvc.perform(post("/api/auth/signup")
                .content(objectMapper.writeValueAsString(signupDTO))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(testUserRepository).existsByUsername(signupDTO.getUsername());
        verify(testRoleRepository).findByName(RoleEnum.ROLE_USER);

    }

    @Test
    @WithMockUser
    void testRegisterUserWithRole() throws Exception {
        SignupDTO signupDTO = new SignupDTO();

        signupDTO.setUsername("user");
        signupDTO.setPassword("pass");
        signupDTO.setRole(Set.of(RoleEnum.ROLE_USER.toString()));

        when(testUserRepository.existsByUsername(signupDTO.getUsername())).thenReturn(false);
        when(testRoleRepository.findByName(RoleEnum.ROLE_USER)).thenReturn(java.util.Optional.of(new Role()));

        mockMvc.perform(post("/api/auth/signup")
                .content(objectMapper.writeValueAsString(signupDTO))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(testUserRepository).existsByUsername(signupDTO.getUsername());
        verify(testRoleRepository).findByName(RoleEnum.ROLE_USER);
    }

    @Test
    @WithMockUser
    void testLogout() throws Exception {
        ResponseCookie responseCookie = ResponseCookie.from("test", "test").build();

        when(jwtUtils.getCleanJwtCookie()).thenReturn(responseCookie);
        mockMvc.perform(post("/api/auth/signout")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(jwtUtils).getCleanJwtCookie();
    }

}
