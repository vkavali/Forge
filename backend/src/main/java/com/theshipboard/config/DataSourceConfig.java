package com.theshipboard.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:postgresql://forge:forge@localhost:5432/forge}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        String url = databaseUrl;

        // Strip jdbc: prefix if present for uniform parsing
        if (url.startsWith("jdbc:")) {
            url = url.substring(5);
        }

        // Parse postgresql://user:pass@host:port/db
        URI uri = URI.create(url);
        String host = uri.getHost();
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String database = uri.getPath().startsWith("/") ? uri.getPath().substring(1) : uri.getPath();
        String username = null;
        String password = null;

        if (uri.getUserInfo() != null) {
            String[] parts = uri.getUserInfo().split(":", 2);
            username = parts[0];
            if (parts.length > 1) password = parts[1];
        }

        String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database;

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        if (username != null) ds.setUsername(username);
        if (password != null) ds.setPassword(password);
        ds.setMaximumPoolSize(10);
        return ds;
    }
}
