package com.cineverse.gateway;

import com.cineverse.gateway.filter.JwtAuthGatewayFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class GatewayApplicationTests {

    @Autowired
    JwtAuthGatewayFilter jwtAuthGatewayFilter;

    @Test
    void contextLoads() {
        assertThat(jwtAuthGatewayFilter).isNotNull();
    }
}
