package com.theshipboard.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "MINIO_ENDPOINT")
public class MinioConfig {

    @Value("${MINIO_ENDPOINT}")
    private String endpoint;

    @Value("${MINIO_ROOT_USER:minioadmin}")
    private String accessKey;

    @Value("${MINIO_ROOT_PASSWORD:minioadmin}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
