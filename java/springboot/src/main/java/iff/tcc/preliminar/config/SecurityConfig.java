package iff.tcc.preliminar.config;

import iff.tcc.preliminar.filters.AuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/clientes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/admin/clientes").permitAll()
                        .requestMatchers(HttpMethod.GET, "/admin/gerentes").permitAll()
                        .anyRequest().authenticated()
                ).csrf(csrf -> csrf
                        .ignoringRequestMatchers("/**"))
                .addFilterBefore(new AuthFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
