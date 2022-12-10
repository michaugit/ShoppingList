package com.agh.shoppingListBackend.app.integration;

import com.agh.shoppingListBackend.app.enums.RoleEnum;
import com.agh.shoppingListBackend.app.models.Role;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.LoginDTO;
import com.agh.shoppingListBackend.app.payload.request.SignupDTO;
import com.agh.shoppingListBackend.app.repository.RoleRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AuthIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    private ObjectMapper objectMapper;

    @Autowired
    UserRepository testUserRepository;

    @Autowired
    RoleRepository testRoleRepository;

    @Autowired
    PasswordEncoder encoder;

    @BeforeAll
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(this.context)
                .apply(springSecurity())
                .build();
        objectMapper = new ObjectMapper();

        Role role = testRoleRepository.findByName(RoleEnum.ROLE_USER)
                .orElseGet(() -> {
                    Role roleToAdd = new Role(RoleEnum.ROLE_USER);
                    testRoleRepository.save(roleToAdd);
                    return roleToAdd;
                });

        if (!testUserRepository.findByUsername("user").isPresent()) {
            User user = new User("user", encoder.encode("pass"));
            user.setRoles(Set.of(role));
            testUserRepository.save(user);
        }
    }

    @Test
    void testIntegrationOfAuthenticateUser() throws Exception {
        String username = "user";
        String password = "pass";

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername(username);
        loginDTO.setPassword(password);

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(loginDTO.getUsername()))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"))
                .andExpect(cookie().exists("shoppingList"));
    }

    @Test
    void testIntegrationOfAuthenticateUserWhichNotExists() throws Exception {
        String username = "usernotexists";
        String password = "pass";

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername(username);
        loginDTO.setPassword(password);

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO))
                .with(csrf()))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("$.message").value("Nieprawidłowa nazwa użytkownika lub hasło. "))
                .andExpect(cookie().doesNotExist("shoppingList"));;
    }


    @Test
    void testIntegrationOfRegister() throws Exception {
        String username = "user2";
        String password = "pass";

        SignupDTO signupDTO = new SignupDTO();
        signupDTO.setUsername(username);
        signupDTO.setPassword(password);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDTO))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));

        Optional<User> registeredUser = testUserRepository.findByUsername(signupDTO.getUsername());
        assertTrue(registeredUser.isPresent());
        assertEquals(signupDTO.getUsername(), registeredUser.get().getUsername());
    }

    @Test
    void testIntegrationOfRegisterOfUserAlreadyExists() throws Exception {
        String username = "user";
        String password = "pass";

        SignupDTO signupDTO = new SignupDTO();
        signupDTO.setUsername(username);
        signupDTO.setPassword(password);

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDTO))
                .with(csrf()))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("$.message").value("Error: Username is already taken!"));
    }


    @Test
    void testIntegrationOfLogout() throws Exception {
        mockMvc.perform(post("/api/auth/signout")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(cookie().value("shoppingList", ""));
    }
}
