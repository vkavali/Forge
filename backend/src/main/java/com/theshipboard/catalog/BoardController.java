package com.theshipboard.catalog;

import com.theshipboard.shared.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
public class BoardController {

    private final BoardCatalog boardCatalog;

    public BoardController(BoardCatalog boardCatalog) {
        this.boardCatalog = boardCatalog;
    }

    @GetMapping("/boards")
    public ResponseEntity<ApiResponse<List<BoardDefinition>>> getBoards(
            @RequestParam(required = false) String category) {
        List<BoardDefinition> boards;
        if (category != null && !category.isBlank()) {
            DeviceCategory cat;
            try {
                cat = DeviceCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid category: " + category);
            }
            boards = boardCatalog.getByCategory(cat);
        } else {
            boards = boardCatalog.getAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(boards));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getCategories() {
        List<Map<String, String>> categories = Stream.of(DeviceCategory.values())
                .map(c -> Map.of(
                        "id", c.name(),
                        "displayName", c.getDisplayName(),
                        "description", c.getDescription(),
                        "icon", c.getIcon()
                ))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
