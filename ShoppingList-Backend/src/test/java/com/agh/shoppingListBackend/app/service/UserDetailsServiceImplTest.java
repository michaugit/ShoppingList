package com.agh.shoppingListBackend.app.service;

import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.agh.shoppingListBackend.app.security.services.UserDetailsImpl;
import com.agh.shoppingListBackend.app.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private UserDetailsServiceImpl userDetailsService;

    private User user;


    @BeforeEach
    void setUp(){
        userDetailsService = new UserDetailsServiceImpl(userRepository);
        user = new User("user", "pass");

        UserDetailsImpl applicationUser = UserDetailsImpl.build(user);
        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).thenReturn(applicationUser);
    }

    @Test
    void testLoadUserByUserName(){
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        UserDetails response = userDetailsService.loadUserByUsername(user.getUsername());

        assertNotNull(response);
        assertEquals(response.getUsername(), user.getUsername());
    }

    @Test
    void testLoadUserByUserNameException() {
        when(userRepository.findByUsername(user.getUsername()))
                .thenThrow(new UsernameNotFoundException("User Not Found with username: " + user.getUsername()));

        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(user.getUsername()));
    }

}
