package com.theshipboard.generation.service;

import io.minio.MinioClient;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
@ConditionalOnMissingBean(MinioClient.class)
public class InMemoryStorageService implements StorageService {

    private final Map<String, String> store = new ConcurrentHashMap<>();

    @Override
    public String upload(String key, String content, String contentType) {
        store.put(key, content);
        return key;
    }

    @Override
    public String download(String key) {
        String content = store.get(key);
        if (content == null) {
            throw new RuntimeException("Artifact not found: " + key);
        }
        return content;
    }
}
