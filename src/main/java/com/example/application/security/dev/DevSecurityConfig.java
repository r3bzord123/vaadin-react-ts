package com.example.application.security.dev;

import com.vaadin.flow.router.RouteConfiguration;
import com.vaadin.flow.server.VaadinServiceInitListener;
import com.vaadin.flow.spring.security.VaadinAwareSecurityContextHolderStrategyConfiguration;
import com.vaadin.flow.spring.security.VaadinSecurityConfigurer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.cloud.CloudPlatform;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for the development environment.
 * <p>
 * This configuration simplifies authentication during development by:
 * <ul>
 * <li>Using a simple login view for authentication</li>
 * <li>Providing predefined test users with fixed credentials</li>
 * <li>Using an in-memory user details service with no external dependencies</li>
 * </ul>
 * </p>
 * <p>
 * This configuration is automatically activated when the {@code prod} Spring profile is not active. It should
 * <strong>not</strong> be used in production environments, as it uses hardcoded credentials and simplified security
 * settings.
 * </p>
 * <p>
 * The predefined users are declared in the {@link SampleUsers} class.
 * </p>
 * <p>
 * This configuration integrates with Vaadin's security framework through {@link VaadinSecurityConfigurer} to provide a
 * seamless login experience in the Vaadin UI.
 * </p>
 *
 * @see DevUserDetailsService The in-memory user details service implementation
 * @see DevUser Builder for creating development test users
 * @see SampleUsers User credentials for the predefined users
 */
@EnableWebSecurity
@Configuration
@Import({ VaadinAwareSecurityContextHolderStrategyConfiguration.class })
@Profile("!prod")
class DevSecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(DevSecurityConfig.class);

    DevSecurityConfig(Environment environment) {
        if (!isRunningLocally(environment)) {
            log.error("Development security config attempted in non-local environment");
            throw new IllegalStateException("Development security can only be used when running locally");
        }
        log.warn("╔═════════════════════════════════════════════════════════════╗");
        log.warn("║                     DEVELOPMENT SECURITY                    ║");
        log.warn("║ This should not be used in production environments.         ║");
        log.warn("╚═════════════════════════════════════════════════════════════╝");
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.with(VaadinSecurityConfigurer.vaadin(), configurer -> configurer.loginView(DevLoginView.LOGIN_PATH))
                .build();
    }

    @Bean
    UserDetailsService userDetailsService() {
        return new DevUserDetailsService(SampleUsers.ALL_USERS);
    }

    @Bean
    VaadinServiceInitListener developmentLoginConfigurer() {
        return (serviceInitEvent) -> {
            if (serviceInitEvent.getSource().getDeploymentConfiguration().isProductionMode()) {
                log.warn("╔════════════════════════════════════════════════════════════════════════════════════════╗");
                log.warn("║ DEVELOPMENT SECURITY is ACTIVE but Vaadin is running in PRODUCTION mode.               ║");
                log.warn("║ If you are testing production mode on your local machine, this is fine.                ║");
                log.warn("║ If you are seeing this in production, you should check your application configuration! ║");
                log.warn("╚════════════════════════════════════════════════════════════════════════════════════════╝");
            }
            var routeConfiguration = RouteConfiguration.forApplicationScope();
            routeConfiguration.setRoute(DevLoginView.LOGIN_PATH, DevLoginView.class);
        };
    }

    private boolean isRunningLocally(Environment environment) {
        boolean hasUserHome = System.getProperty("user.home") != null;
        CloudPlatform activePlatform = CloudPlatform.getActive(environment);

        log.info("Local environment check - User home: {}, Cloud platform: {}", hasUserHome, activePlatform);

        return hasUserHome && activePlatform == null;
    }
}
