import {
    DRINK_MENU,
    getDailySpecial,
    DAILY_SPECIAL_DISCOUNT,
} from "../../data/drinks.js";
import { EmbedBuilder } from "discord.js";
import {
    adjustMood,
    getMoodDescriptor,
    getMoodStatusPhrase,
} from "../services/personalityService.js";

export async function mixDrink(interaction) {
    const drinkName = interaction.options.getString("drink");
    const drink = DRINK_MENU[drinkName];

    if (!drink) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#FF003C")
                    .setTitle("❌ Stock Check Failure")
                    .setDescription(
                        "```SYNTH-INGREDIENT NOT FOUND```\n*scans inventory...*",
                    )
                    .setThumbnail("https://i.imgur.com/7XZTtsC.png"),
            ],
            ephemeral: true,
        });
    }

    let progressMessage;
    let currentSteps = [];

    try {
        // Mood system initialization
        let moodHeader = "";
        if (typeof drink.moodEffect === "number") {
            adjustMood(drink.moodEffect);
            const moodState = getMoodDescriptor();
            moodHeader =
                {
                    ANNOYED: "**[WARNING: LOW KARMOTRINE LEVELS]**",
                    NEUTRAL: "**[STANDARD MIXING PROTOCOL]**",
                    CHEERFUL: "**[ENHANCED MIXING ENABLED]**",
                }[moodState] + "\n\n";
        }

        // Initial embed with first step
        currentSteps.push(drink.steps[0]);
        const progressEmbed = new EmbedBuilder()
            .setColor("#4B0082")
            .setTitle(`◈ ${drinkName} SYNTHESIS ◈`)
            .setDescription(
                `${moodHeader}` +
                    "**PROGRESS:**\n" +
                    currentSteps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
            )
            .setThumbnail(drink.image);

        progressMessage = await interaction.reply({
            embeds: [progressEmbed],
            fetchReply: true,
        });

        // Progressive embedded updates
        for (let i = 1; i < drink.steps.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            currentSteps.push(drink.steps[i]);

            const updatedEmbed = new EmbedBuilder()
                .setColor("#4B0082")
                .setTitle(`◈ ${drinkName} SYNTHESIS ◈`)
                .setDescription(
                    `${moodHeader}` +
                        "**PROGRESS:**\n" +
                        currentSteps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
                )
                .setThumbnail(drink.image);

            await progressMessage.edit({ embeds: [updatedEmbed] });
        }

        // Final presentation embed
        const isSpecial = drinkName === getDailySpecial();
        const price = isSpecial
            ? Math.floor(drink.price * (1 - DAILY_SPECIAL_DISCOUNT))
            : drink.price;

        const resultEmbed = new EmbedBuilder()
            .setColor("#00FF9F")
            .setTitle(`██████████▓▒­░⡷${drinkName}⡸░▒▓██████████`)
            .addFields(
                {
                    name: "◈ PRICE ◈",
                    value: `**${price}G**${isSpecial ? " (DAILY SPECIAL)" : ""}`,
                    inline: true,
                },
                {
                    name: "◈ EFFECT MATRIX ◈",
                    value: drink.effect,
                    inline: true,
                },
                {
                    name: "◈ NEURAL ANALYSIS ◈",
                    value: getMoodStatusPhrase(),
                    inline: false,
                },
            )
            .setImage(drink.image)
            .setFooter({
                text: `${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            });

        await progressMessage.edit({
            content: `
░█▀▀░█░█░█▀█░▀█▀░█░█░█▀▀░█▀▀░▀█▀░█▀▀
░▀▀█░░█░░█░█░░█░░█▀█░█▀▀░▀▀█░░█░░▀▀█
░▀▀▀░░▀░░▀░▀░░▀░░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀
░█▀▀░█▀█░█▄█░█▀█░█░░░█▀▀░▀█▀░█▀▀░█▀▄
░█░░░█░█░█░█░█▀▀░█░░░█▀▀░░█░░█▀▀░█░█
░▀▀▀░▀▀▀░▀░▀░▀░░░▀▀▀░▀▀▀░░▀░░▀▀▀░▀▀░                                
         
`,
            embeds: [resultEmbed],
        });
    } catch (error) {
        console.error("Mixing Protocol Failure:", error);

        const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("〘⚠️ SYSTEM MALFUNCTION 〙")
            .setDescription(
                "```KARMOTRINE PRESSURE CRITICAL```\n*Emergency shutdown initiated...*",
            )
            .setThumbnail();

        if (progressMessage) {
            await progressMessage.edit({
                content: "",
                embeds: [errorEmbed],
            });
        } else {
            await interaction.followUp({
                embeds: [errorEmbed],
                ephemeral: true,
            });
        }
    }
}
