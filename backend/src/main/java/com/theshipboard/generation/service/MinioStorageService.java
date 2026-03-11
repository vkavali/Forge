package com.theshipboard.generation.service;

import io.minio.*;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@Service
@ConditionalOnBean(MinioClient.class)
public class MinioStorageService {

    private static final Logger log = LoggerFactory.getLogger(MinioStorageService.class);
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    public MinioStorageService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @PostConstruct
    public void init() {
        try {
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                log.info("Created MinIO bucket: {}", bucket);
            }
        } catch (Exception e) {
            log.warn("Could not initialize MinIO bucket: {}", e.getMessage());
        }
    }

    public String upload(String key, String content, String contentType) {
        try {
            byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket).object(key)
                    .stream(new ByteArrayInputStream(bytes), bytes.length, -1)
                    .contentType(contentType).build());
            return key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to MinIO: " + e.getMessage(), e);
        }
    }

    public String download(String key) {
        try (InputStream stream = minioClient.getObject(GetObjectArgs.builder()
                .bucket(bucket).object(key).build())) {
            return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to download from MinIO: " + e.getMessage(), e);
        }
    }

    public String getPresignedUrl(String key) {
        try {
            return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET).bucket(bucket).object(key)
                    .expiry(1, TimeUnit.HOURS).build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL: " + e.getMessage(), e);
        }
    }
}
