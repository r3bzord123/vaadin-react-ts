package com.example.application.security.hilla;

import com.example.application.security.AppUserInfo;
import com.example.application.security.AppUserPrincipal;
import com.example.application.security.CurrentUser;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Browser callable service for making the current {@link AppUserPrincipal} available to Hilla clients.
 * <p>
 * This service provides a secure way for frontend applications to access information about the currently authenticated
 * user. The service is accessible to all authenticated users without additional authorization checks.
 * </p>
 * <p>
 * Java clients should not use this class, but interact with {@link CurrentUser} directly.
 * </p>
 */
@BrowserCallable
@PermitAll
class CurrentUserService {

    private final CurrentUser currentUser;

    CurrentUserService(CurrentUser currentUser) {
        this.currentUser = currentUser;
    }

    /**
     * Data transfer object containing user information for client-side consumption.
     * <p>
     * This record encapsulates all user data that is safe to expose to the frontend, including profile information,
     * preferences, and security authorities.
     * </p>
     *
     * @param userId
     *            the user's {@linkplain AppUserInfo#getUserId() unique identifier} (never {@code null})
     * @param preferredUsername
     *            the user's {@linkplain AppUserInfo#getPreferredUsername() preferred username} (never {@code null})
     * @param fullName
     *            the user's {@linkplain AppUserInfo#getFullName() full name} (never {@code null})
     * @param profileUrl
     *            URL to the user's {@linkplain AppUserInfo#getProfileUrl() profile page}, or {@code null} if not
     *            available
     * @param pictureUrl
     *            URL to the user's {@linkplain AppUserInfo#getPictureUrl() profile picture}, or {@code null} if not
     *            available
     * @param email
     *            the user's {@linkplain AppUserInfo#getEmail() email address}, or {@code null} if not available
     * @param zoneId
     *            the user's {@linkplain AppUserInfo#getZoneId() timezone identifier} (e.g., "Europe/Helsinki"; never
     *            {@code null})
     * @param locale
     *            the user's {@linkplain AppUserInfo#getLocale() locale preference} (e.g., "en-US"; never {@code null})
     * @param authorities
     *            collection of {@linkplain AppUserPrincipal#getAuthorities() granted authorities/roles} for this user
     *            (ever {@code null} but may be empty)
     */
    public record UserInfo(@NonNull String userId, @NonNull String preferredUsername, @NonNull String fullName,
            @Nullable String profileUrl, @Nullable String pictureUrl, @Nullable String email, @NonNull String zoneId,
            @NonNull String locale, @NonNull Collection<String> authorities) {
    }

    /**
     * Retrieves information about the currently authenticated user.
     * <p>
     * This method extracts user data from the current security context and returns it in a format suitable for frontend
     * consumption. All sensitive information is excluded, and only data that is safe to expose to the client is
     * included.
     *
     * @return a {@link UserInfo} record containing the current user's information
     * @throws AuthenticationCredentialsNotFoundException
     *             if there is no authenticated user, or the authenticated principal doesn't implement
     *             {@link AppUserPrincipal}
     */
    public @NonNull UserInfo getUserInfo() {
        var principal = currentUser.requirePrincipal();
        var user = principal.getAppUser();
        var authorities = principal.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
        return new UserInfo(user.getUserId().toString(), user.getPreferredUsername(), user.getFullName(),
                user.getProfileUrl(), user.getPictureUrl(), user.getEmail(), user.getZoneId().toString(),
                user.getLocale().toString(), authorities);
    }
}
