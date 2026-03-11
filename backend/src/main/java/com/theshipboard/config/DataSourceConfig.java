package com.theshipboard.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:jdbc:postgresql://localhost:5432/forge?user=forge&password=forge}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() {
        String url = databaseUrl;
        if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
            url = "jdbc:" + url;
        }
        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(url);
        ds.setMaximumPoolSize(10);
        return ds;
    }
}
