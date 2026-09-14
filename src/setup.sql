
CREATE TABLE IF NOT EXISTS organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
    (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );


CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL
        REFERENCES organizations(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
    -- ─────────────── BrightFuture Builders ───────────────
    (
        (SELECT organization_id FROM organizations WHERE name = 'BrightFuture Builders'),
        'Riverside Community Center Rebuild',
        'Rebuild the storm-damaged community center using sustainable timber and solar power.',
        'Riverside Park, Springfield',
        '2026-04-12'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'BrightFuture Builders'),
        'Affordable Housing Retrofit',
        'Retrofit 20 low-income homes with insulation, efficient windows, and heat pumps.',
        'Eastside Neighborhood, Springfield',
        '2026-05-03'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'BrightFuture Builders'),
        'Solar Power for Schools',
        'Install rooftop solar panels on three local elementary schools to cut energy costs.',
        'Springfield School District',
        '2026-06-21'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'BrightFuture Builders'),
        'Accessible Playground Build',
        'Construct an all-abilities playground with ramps, sensory equipment, and shade structures.',
        'Maple Grove Park, Springfield',
        '2026-07-15'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'BrightFuture Builders'),
        'Rainwater Harvesting System',
        'Install rainwater catchment and filtration systems for the community garden and tool shed.',
        'Northside Community Garden, Springfield',
        '2026-08-09'
    ),

    -- ─────────────── GreenHarvest Growers ───────────────
    (
        (SELECT organization_id FROM organizations WHERE name = 'GreenHarvest Growers'),
        'Spring Planting Festival',
        'Kick off the growing season with seed swaps, planting workshops, and a community potluck.',
        'Downtown Community Garden, Riverton',
        '2026-03-28'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'GreenHarvest Growers'),
        'Urban Orchard Expansion',
        'Plant 60 fruit trees across three city parks to create a public foraging orchard.',
        'Riverton City Parks',
        '2026-04-19'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'GreenHarvest Growers'),
        'Youth Gardening Program',
        'A 10-week after-school program teaching kids to grow, harvest, and cook their own food.',
        'Riverton Youth Center',
        '2026-05-11'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'GreenHarvest Growers'),
        'Composting Workshop Series',
        'Monthly workshops teaching residents how to compost kitchen scraps at home.',
        'Riverton Public Library',
        '2026-06-07'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'GreenHarvest Growers'),
        'Farmers Market Food Drive',
        'Collect surplus produce from local vendors and distribute it to nearby food banks.',
        'Riverton Farmers Market',
        '2026-07-25'
    ),

    -- ─────────────── UnityServe Volunteers ───────────────
    (
        (SELECT organization_id FROM organizations WHERE name = 'UnityServe Volunteers'),
        'Neighborhood Cleanup Day',
        'Mobilize 100 volunteers to clean up litter and plant flowers along the riverwalk.',
        'Riverwalk, Lakeside',
        '2026-04-05'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'UnityServe Volunteers'),
        'Senior Companionship Visits',
        'Weekly volunteer visits to isolated seniors in assisted-living facilities.',
        'Lakeside Senior Center',
        '2026-05-17'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'UnityServe Volunteers'),
        'Back-to-School Supply Drive',
        'Collect and distribute backpacks, notebooks, and pencils to families in need.',
        'Lakeside Community Hall',
        '2026-08-01'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'UnityServe Volunteers'),
        'Holiday Meal Delivery',
        'Prepare and deliver hot meals to homebound residents during the holiday season.',
        'Lakeside Food Bank',
        '2026-12-20'
    ),
    (
        (SELECT organization_id FROM organizations WHERE name = 'UnityServe Volunteers'),
        'Animal Shelter Support Day',
        'Volunteers help walk dogs, clean kennels, and organize donation drives for the shelter.',
        'Lakeside Animal Shelter',
        '2026-09-14'
    );


CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS projects_categories (
    project_id INTEGER NOT NULL
        REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL
        REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO categories (name)
VALUES
    ('Community Building'),
    ('Environmental Sustainability'),
    ('Education'),
    ('Food Security'),
    ('Health & Wellness'),
    ('Youth Development'),
    ('Senior Support'),
    ('Animal Welfare'),
    ('Housing'),
    ('Infrastructure')
ON CONFLICT (name) DO NOTHING;

INSERT INTO projects_categories (project_id, category_id)
VALUES
    -- Riverside Community Center Rebuild → Community Building + Infrastructure
    (
        (SELECT project_id FROM projects WHERE title = 'Riverside Community Center Rebuild'),
        (SELECT category_id FROM categories WHERE name = 'Community Building')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Riverside Community Center Rebuild'),
        (SELECT category_id FROM categories WHERE name = 'Infrastructure')
    ),

    -- Solar Power for Schools → Environmental Sustainability + Education
    (
        (SELECT project_id FROM projects WHERE title = 'Solar Power for Schools'),
        (SELECT category_id FROM categories WHERE name = 'Environmental Sustainability')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Solar Power for Schools'),
        (SELECT category_id FROM categories WHERE name = 'Education')
    ),

    -- Urban Orchard Expansion → Environmental Sustainability + Food Security
    (
        (SELECT project_id FROM projects WHERE title = 'Urban Orchard Expansion'),
        (SELECT category_id FROM categories WHERE name = 'Environmental Sustainability')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Urban Orchard Expansion'),
        (SELECT category_id FROM categories WHERE name = 'Food Security')
    ),

    -- Youth Gardening Program → Education + Youth Development + Food Security
    (
        (SELECT project_id FROM projects WHERE title = 'Youth Gardening Program'),
        (SELECT category_id FROM categories WHERE name = 'Education')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Youth Gardening Program'),
        (SELECT category_id FROM categories WHERE name = 'Youth Development')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Youth Gardening Program'),
        (SELECT category_id FROM categories WHERE name = 'Food Security')
    ),

    -- Senior Companionship Visits → Senior Support + Health & Wellness
    (
        (SELECT project_id FROM projects WHERE title = 'Senior Companionship Visits'),
        (SELECT category_id FROM categories WHERE name = 'Senior Support')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Senior Companionship Visits'),
        (SELECT category_id FROM categories WHERE name = 'Health & Wellness')
    ),

    -- Animal Shelter Support Day → Animal Welfare
    (
        (SELECT project_id FROM projects WHERE title = 'Animal Shelter Support Day'),
        (SELECT category_id FROM categories WHERE name = 'Animal Welfare')
    ),

    -- Affordable Housing Retrofit → Housing + Infrastructure
    (
        (SELECT project_id FROM projects WHERE title = 'Affordable Housing Retrofit'),
        (SELECT category_id FROM categories WHERE name = 'Housing')
    ),
    (
        (SELECT project_id FROM projects WHERE title = 'Affordable Housing Retrofit'),
        (SELECT category_id FROM categories WHERE name = 'Infrastructure')
    )
ON CONFLICT (project_id, category_id) DO NOTHING;
