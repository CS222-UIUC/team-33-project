#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>  // for usleep function

int main(int argc, char *argv[]) {
    if (argc != 4) {
        fprintf(stderr, "Usage: %s lower_bound upper_bound sleep_duration\n", argv[0]);
        return 1;
    }

    // Convert command-line arguments to floats for bounds and sleep duration
    float lower = atof(argv[1]);
    float upper = atof(argv[2]);
    float sleep_duration = atof(argv[3]);  // now supports fractional seconds

    if (lower > upper) {
        fprintf(stderr, "Error: lower_bound must be less than or equal to upper_bound\n");
        return 1;
    }

    // Seed the random number generator
    srand(time(NULL));

    while (1) {
        // Generate a random float in [0, 1]
        float scale = rand() / (float)RAND_MAX;
        // Scale and shift the value to the desired range [lower, upper]
        float num = lower + scale * (upper - lower);

        // Open file for writing (overwrites existing content)
        FILE *file = fopen("simulated_data.txt", "w");
        if (file == NULL) {
            perror("Error opening file");
            return 1;
        }
        
        fprintf(file, "%f", num);
        fclose(file);

        printf("Updated value: %f\n", num);
        // Convert sleep_duration from seconds to microseconds for usleep
        usleep((useconds_t)(sleep_duration * 1000000));
    }

    return 0;
}
