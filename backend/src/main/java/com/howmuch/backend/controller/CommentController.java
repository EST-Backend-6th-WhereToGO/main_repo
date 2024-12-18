package com.howmuch.backend.controller;

import com.howmuch.backend.entity.community.Post;
import com.howmuch.backend.entity.community.PostComment;
import com.howmuch.backend.entity.DTO.CommentRequestDTO;
import com.howmuch.backend.entity.DTO.CommentResponseDTO;
import com.howmuch.backend.service.CommentService;
import com.howmuch.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByPostId(@PathVariable Long postId) {
        List<CommentResponseDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponseDTO> getCommentById(@PathVariable Long commentId) {
        Optional<CommentResponseDTO> comment = commentService.getCommentById(commentId);
        return comment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/comments")
    public ResponseEntity<CommentResponseDTO> createComment(@RequestBody CommentRequestDTO requestDTO) {

        CommentResponseDTO responseDTO = commentService.createComment(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable Long commentId,
                                                            @RequestBody PostComment updatedComment,
                                                            OAuth2AuthenticationToken authentication) {
        // 로그인된 사용자 확인
        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);

        // 댓글 수정 서비스 호출
        Optional<CommentResponseDTO> comment = commentService.updateComment(commentId, updatedComment, sessionUserId);

        return comment.map(ResponseEntity::ok) // 성공: 수정된 댓글 반환
                .orElseGet(() -> ResponseEntity.status(HttpStatus.FORBIDDEN).build()); // 실패: 403
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                              OAuth2AuthenticationToken authentication) {
        String email = authentication.getPrincipal().getAttribute("email");
        Long sessionUserId = userService.getUserIdByEmail(email);

        commentService.deleteComment(commentId, sessionUserId);
        return ResponseEntity.noContent().build();

    }
}
