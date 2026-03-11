package com.theshipboard.generation.service;

public interface StorageService {
    String upload(String key, String content, String contentType);
    String download(String key);
}
