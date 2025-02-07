package iff.tcc.preliminar.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import iff.tcc.preliminar.exception.NaoAutorizadoException;
import iff.tcc.preliminar.utils.TokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if(request.getHeader("Authorization") != null){
            Authentication auth = TokenUtil.decodeToken(request);
            if (auth != null){
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else{
                throw new NaoAutorizadoException("Usuário não autorizado");
            }
        }
        filterChain.doFilter(request, response);
    }
}
